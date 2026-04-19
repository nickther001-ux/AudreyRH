import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync, getUncachableStripeClient } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import { storage } from "./storage";
import { processBooking } from "./booking";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping Stripe initialization');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ 
      databaseUrl,
      schema: 'stripe'
    });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    const replitDomains = process.env.REPLIT_DOMAINS;
    if (replitDomains) {
      console.log('Setting up managed webhook...');
      const webhookBaseUrl = `https://${replitDomains.split(',')[0]}`;
      try {
        const result = await stripeSync.findOrCreateManagedWebhook(
          `${webhookBaseUrl}/api/stripe/webhook`);
        if (result?.webhook?.url) {
          console.log(`Webhook configured: ${result.webhook.url}`);
        } else {
          console.log('Webhook setup completed (no URL returned)');
        }
      } catch (webhookError) {
        console.log('Could not set up managed webhook:', webhookError);
      }
    } else {
      console.log('REPLIT_DOMAINS not set, skipping webhook setup');
    }

    stripeSync.syncBackfill()
      .then(() => {
        console.log('Stripe data synced');
      })
      .catch((err: Error) => {
        console.error('Error syncing Stripe data:', err);
      });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

async function fixAvailabilitySchema() {
  try {
    const { pool } = await import('./db');
    // 1. Delete all null-dated slots (legacy data)
    const del = await pool.query("DELETE FROM availability_slots WHERE date IS NULL");
    if (del.rowCount && del.rowCount > 0) {
      console.log(`[Startup] Removed ${del.rowCount} null-dated availability slot(s)`);
    }
    // 2. Enforce NOT NULL on the date column if it is still nullable
    const colInfo = await pool.query(`
      SELECT is_nullable FROM information_schema.columns
      WHERE table_name = 'availability_slots' AND column_name = 'date'
    `);
    if (colInfo.rows[0]?.is_nullable === 'YES') {
      await pool.query("ALTER TABLE availability_slots ALTER COLUMN date SET NOT NULL");
      console.log("[Startup] Enforced NOT NULL on availability_slots.date");
    }
  } catch (err: any) {
    console.error("[Startup] fixAvailabilitySchema error:", err.message);
  }
}

async function fixAppointmentsSchema() {
  try {
    const { pool } = await import('./db');
    // Check the current type and nullability of appointments.date
    const colInfo = await pool.query(`
      SELECT data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'appointments' AND column_name = 'date'
    `);
    const col = colInfo.rows[0];
    if (!col) return;

    const isTimestamp = col.data_type === 'timestamp without time zone' || col.data_type === 'timestamp with time zone';
    const isNotNull = col.is_nullable === 'NO';

    if (isTimestamp) {
      // Convert from timestamp to date type, allow nulls (free consultations have no date)
      await pool.query("ALTER TABLE appointments ALTER COLUMN date TYPE date USING date::date");
      console.log("[Startup] Converted appointments.date from timestamp to date");
    }
    if (isTimestamp || isNotNull) {
      await pool.query("ALTER TABLE appointments ALTER COLUMN date DROP NOT NULL");
      console.log("[Startup] Dropped NOT NULL constraint on appointments.date");
    }
  } catch (err: any) {
    console.error("[Startup] fixAppointmentsSchema error:", err.message);
  }
}

async function ensureMeetLinkColumn() {
  try {
    const { pool } = await import('./db');
    await pool.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS meet_link TEXT`);
    console.log('[Startup] appointments.meet_link column ready');
  } catch (err: any) {
    console.error('[Startup] ensureMeetLinkColumn error:', err.message);
  }
}

async function ensureLeadsTable() {
  try {
    const { pool } = await import('./db');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        summary TEXT,
        segment TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS segment TEXT`);
    await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS primary_goal TEXT`);
    console.log("[Startup] leads table ready");
  } catch (err: any) {
    console.error("[Startup] ensureLeadsTable error:", err.message);
  }
}

(async () => {
  await fixAvailabilitySchema();
  await fixAppointmentsSchema();
  await ensureMeetLinkColumn();
  await ensureLeadsTable();
  await initStripe();

  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature' });
      }

      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;

        if (!Buffer.isBuffer(req.body)) {
          console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer.');
          return res.status(500).json({ error: 'Webhook processing error' });
        }

        await WebhookHandlers.processWebhook(req.body as Buffer, sig);

        // Also handle checkout.session.completed to trigger our booking pipeline
        try {
          const stripe = await getUncachableStripeClient();
          const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
          let event: any;
          if (webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
          } else {
            event = JSON.parse(req.body.toString());
          }

          if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const appointmentId = parseInt(session.metadata?.appointmentId, 10);
            if (!isNaN(appointmentId)) {
              const appointment = await storage.getAppointment(appointmentId);
              if (appointment && appointment.paymentStatus !== 'paid') {
                console.log(`[Webhook] Processing paid booking for appointment #${appointmentId}`);
                await processBooking(appointment.name, appointment.email, {
                  appointmentId: appointment.id,
                  date: appointment.date ?? null,
                  startTime: appointment.startTime ?? null,
                  endTime: appointment.endTime ?? null,
                  platform: appointment.platform,
                  reason: appointment.reason,
                  amount: (session.amount_total / 100).toFixed(2),
                  stripeId: session.payment_intent ?? session.id,
                });
                await storage.updateAppointmentPayment(appointmentId, session.payment_intent ?? session.id);
              } else {
                console.log(`[Webhook] Appointment #${appointmentId} already paid or not found — skipping`);
              }
            }
          }
        } catch (customErr: any) {
          console.error('[Webhook] Custom booking handler error (non-fatal):', customErr.message);
        }

        res.status(200).json({ received: true });
      } catch (error: any) {
        console.error('Webhook error:', error.message);
        res.status(400).json({ error: 'Webhook processing error' });
      }
    }
  );

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
