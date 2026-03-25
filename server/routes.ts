import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.appointments.create.path, async (req, res) => {
    try {
      const input = api.appointments.create.input.parse(req.body);
      
      // If a slot was selected, verify it exists and try to book it atomically
      if (input.slotId) {
        const bookedSlot = await storage.bookSlot(input.slotId);
        if (!bookedSlot) {
          // Either slot doesn't exist or was already booked by another request
          return res.status(400).json({ message: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.' });
        }
      }
      
      const appointment = await storage.createAppointment(input);
      
      let checkoutUrl: string | null = null;
      
      try {
        const { getUncachableStripeClient } = await import("./stripeClient");
        const stripe = await getUncachableStripeClient();
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'cad',
                product_data: {
                  name: 'Consultation with Audrey Mondesir, CRIA',
                  description: `Career strategy consultation for ${input.name}`,
                },
                unit_amount: 8500,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/book?success=true&appointmentId=${appointment.id}&email=${encodeURIComponent(appointment.email)}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.protocol}://${req.get('host')}/book?canceled=true`,
          metadata: {
            appointmentId: appointment.id.toString(),
          },
          customer_email: input.email,
        });

        checkoutUrl = session.url;
      } catch (stripeError: any) {
        console.error('Stripe checkout creation failed:', stripeError.message);
      }

      res.status(201).json({ 
        appointment, 
        checkoutUrl 
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error('Error creating appointment:', err);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  });

  app.get(api.appointments.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid ID" });
    }

    const appointment = await storage.getAppointment(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json(appointment);
  });

  // Confirm payment and send emails — idempotent (safe to call multiple times)
  app.post('/api/appointments/:id/confirm', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Idempotency — if already confirmed, just return
      if (appointment.paymentStatus === 'paid') {
        return res.json({ success: true, alreadyConfirmed: true });
      }

      await storage.updateAppointmentPayment(id, '');

      // Send confirmation emails (non-blocking — don't fail the response if email errors)
      try {
        const { sendBookingConfirmation } = await import('./resend');
        const dateStr = appointment.date
          ? new Date(appointment.date).toLocaleDateString('fr-CA', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })
          : '';
        await sendBookingConfirmation({
          clientName: appointment.name,
          clientEmail: appointment.email,
          date: dateStr,
          startTime: appointment.startTime ?? null,
          endTime: appointment.endTime ?? null,
          platform: appointment.platform,
          reason: appointment.reason,
          amount: '85.00',
          stripeId: appointment.stripePaymentIntentId ?? undefined,
        });
      } catch (emailErr: any) {
        console.error('Email send failed (non-fatal):', emailErr.message);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Error confirming appointment:', err);
      res.status(500).json({ message: 'Failed to confirm appointment' });
    }
  });

  // Retrieve customer email from a Stripe checkout session (fallback for success page)
  app.get('/api/stripe/session-email', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    try {
      const { getUncachableStripeClient } = await import('./stripeClient');
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const email = session.customer_email || session.customer_details?.email || '';
      res.json({ email });
    } catch (err: any) {
      console.error('Session email lookup failed:', err.message);
      res.status(500).json({ message: 'Failed to retrieve session' });
    }
  });

  app.get('/api/stripe/publishable-key', async (req, res) => {
    try {
      const { getStripePublishableKey } = await import("./stripeClient");
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error('Error getting publishable key:', error.message);
      res.status(500).json({ message: 'Stripe not configured' });
    }
  });

  // Contact / grant application form — sends lead + auto-reply emails
  app.post('/api/contact', async (req, res) => {
    const { name, email, grantType, projectDescription } = req.body;
    if (!name || !email || !grantType || !projectDescription) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    try {
      const { sendContactEmails } = await import('./resend');
      await sendContactEmails({ name, email, grantType, projectDescription });
      res.json({ success: true });
    } catch (err: any) {
      console.error('Contact form email error:', err.message);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Admin login — validates against ADMIN_PASSWORD secret
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body ?? {};
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return res.status(500).json({ message: 'Admin password not configured' });
    }
    if (!password || password !== adminPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    res.json({ success: true });
  });

  // Admin routes - get all appointments
  app.get('/api/admin/appointments', async (req, res) => {
    try {
      const allAppointments = await storage.getAllAppointments();
      res.json(allAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  // Availability routes
  app.post(api.availability.create.path, async (req, res) => {
    try {
      const input = api.availability.create.input.parse(req.body);
      const slot = await storage.createAvailabilitySlot(input);
      res.status(201).json(slot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error('Error creating availability slot:', err);
      res.status(500).json({ message: 'Failed to create availability slot' });
    }
  });

  app.get(api.availability.list.path, async (req, res) => {
    try {
      const slots = await storage.getAvailableSlots();
      res.json(slots);
    } catch (err) {
      console.error('Error fetching availability slots:', err);
      res.status(500).json({ message: 'Failed to fetch availability slots' });
    }
  });

  app.delete('/api/availability/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid ID" });
      }
      await storage.deleteAvailabilitySlot(id);
      res.json({ success: true });
    } catch (err) {
      console.error('Error deleting availability slot:', err);
      res.status(500).json({ message: 'Failed to delete availability slot' });
    }
  });


  return httpServer;
}
