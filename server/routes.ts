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
      const isFree = input.appointmentType === 'free_consultation';
      const isBusiness = input.appointmentType === 'business_consultation';

      // For PAID bookings only: lock the slot atomically
      if (!isFree && input.slotId) {
        const bookedSlot = await storage.bookSlot(input.slotId);
        if (!bookedSlot) {
          return res.status(400).json({ message: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.' });
        }
      }

      const appointment = await storage.createAppointment(input);

      // ── FREE CONSULTATION — send notification emails, no payment ──
      if (isFree) {
        try {
          const { sendFreeConsultationRequest } = await import('./resend');
          const dateStr = appointment.date
            ? new Date(appointment.date).toLocaleDateString('fr-CA', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })
            : '';
          await sendFreeConsultationRequest({
            clientName: appointment.name,
            clientEmail: appointment.email,
            phone: appointment.phone,
            preferredDate: dateStr,
            preferredTime: appointment.startTime
              ? `${appointment.startTime}${appointment.endTime ? ' – ' + appointment.endTime : ''}`
              : '',
            platform: appointment.platform,
            reason: appointment.reason,
          });
        } catch (emailErr: any) {
          console.error('Free consultation email failed (non-fatal):', emailErr.message);
        }
        return res.status(201).json({ appointment, checkoutUrl: null, type: 'free_consultation' });
      }

      // ── PAID / BUSINESS — create Stripe checkout session ──
      const unitAmount = isBusiness ? 25000 : 8500;
      const productName = isBusiness
        ? 'Consultation Entreprise — AudreyRH, CRIA'
        : 'Consultation with Audrey Mondesir, CRIA';
      const productDesc = isBusiness
        ? `Stratégie RH & consultation d'affaires pour ${input.name}`
        : `Career strategy consultation for ${input.name}`;

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
                  name: productName,
                  description: productDesc,
                },
                unit_amount: unitAmount,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/book?success=true&appointmentId=${appointment.id}&email=${encodeURIComponent(appointment.email)}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.protocol}://${req.get('host')}/book?canceled=true`,
          metadata: { appointmentId: appointment.id.toString() },
          customer_email: input.email,
        });
        checkoutUrl = session.url;
      } catch (stripeError: any) {
        console.error('Stripe checkout creation failed:', stripeError.message);
      }

      res.status(201).json({ appointment, checkoutUrl, type: 'paid_service' });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error('[Appointment] Error creating appointment:', err);
      const msg = err?.message ?? String(err);
      res.status(500).json({ message: msg || 'Failed to create appointment' });
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

  // Contact / grant questionnaire — sends lead + auto-reply emails
  app.post('/api/contact', async (req, res) => {
    const {
      name, email, companyName, registrationInfo, cities, activities,
      fundingNeeds, dreams, pastGrants, employees, planToHire, openToInterns, desjardins,
    } = req.body;
    if (!name || !email || !companyName || !registrationInfo || !cities || !activities ||
        !fundingNeeds || !dreams || !pastGrants || !employees || !planToHire || !openToInterns || !desjardins) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    try {
      const { sendContactEmails } = await import('./resend');
      await sendContactEmails({
        name, email, companyName, registrationInfo, cities, activities,
        fundingNeeds, dreams, pastGrants, employees, planToHire, openToInterns, desjardins,
      });
      res.json({ success: true });
    } catch (err: any) {
      console.error('Contact form email error:', err.message);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Simple contact form — name, email, type, message
  app.post('/api/contact-simple', async (req, res) => {
    const { name, email, type, message } = req.body;
    if (!name || !email || !type || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    try {
      const { sendSimpleContactEmail } = await import('./resend');
      await sendSimpleContactEmail({ name, email, type, message });
      res.json({ success: true });
    } catch (err: any) {
      const detail = err?.message ?? String(err);
      console.error('Simple contact form error:', detail);
      res.status(500).json({ message: 'Failed to send message', detail });
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

  // Admin — list upcoming availability slots (future-only, null-date-safe)
  app.get('/api/admin/availability', async (req, res) => {
    try {
      const slots = await storage.getAdminSlots();
      console.log(`[Slots] Admin fetch: ${slots.length} slot(s)`);
      res.json(slots);
    } catch (err) {
      console.error('Error fetching admin availability slots:', err);
      res.status(500).json({ message: 'Failed to fetch slots' });
    }
  });

  // Create Google Meet link and return it (standalone — does not mutate DB)
  app.post('/api/appointments/approve', async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
        description: z.string().optional(),
      });

      const { name, email, startTime, endTime, description } = schema.parse(req.body);

      const { createGoogleMeetEvent } = await import('./googleMeet');

      const result = await createGoogleMeetEvent({
        summary: `Consultation AudreyRH — ${name}`,
        description: description ?? `Consultation stratégique de carrière avec ${name} (${email})`,
        startTime,
        endTime,
        attendeeEmail: email,
      });

      res.json({ success: true, meetLink: result.meetLink, eventId: result.eventId, htmlLink: result.htmlLink });
    } catch (err: any) {
      console.error('Error creating Google Meet event:', err.message);
      res.status(500).json({ success: false, message: err.message ?? 'Failed to create Google Meet event' });
    }
  });

  // Admin — approve appointment
  app.patch('/api/admin/appointments/:id/approve', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
    try {
      const appointment = await storage.updateAppointmentStatus(id, 'confirmed');
      try {
        const { sendAppointmentApproved } = await import('./resend');
        const dateStr = appointment.date
          ? new Date(appointment.date).toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          : '';
        await sendAppointmentApproved({
          clientName: appointment.name, clientEmail: appointment.email,
          date: dateStr, startTime: appointment.startTime ?? null, endTime: appointment.endTime ?? null,
          platform: appointment.platform, reason: appointment.reason,
        });
      } catch (emailErr: any) { console.error('Approve email failed:', emailErr.message); }
      res.json({ success: true, appointment });
    } catch (err) {
      console.error('Error approving appointment:', err);
      res.status(500).json({ message: 'Failed to approve appointment' });
    }
  });

  // Admin — reject appointment
  app.patch('/api/admin/appointments/:id/reject', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
    try {
      const appointment = await storage.updateAppointmentStatus(id, 'cancelled');
      try {
        const { sendAppointmentRejected } = await import('./resend');
        await sendAppointmentRejected({
          clientName: appointment.name, clientEmail: appointment.email,
        });
      } catch (emailErr: any) { console.error('Reject email failed:', emailErr.message); }
      res.json({ success: true, appointment });
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      res.status(500).json({ message: 'Failed to reject appointment' });
    }
  });

  // Admin — reschedule appointment
  app.patch('/api/admin/appointments/:id/reschedule', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
    const { date, startTime, endTime } = req.body;
    if (!date || !startTime || !endTime) return res.status(400).json({ message: 'date, startTime, endTime required' });
    try {
      const appointment = await storage.rescheduleAppointment(id, new Date(date), startTime, endTime);
      try {
        const { sendAppointmentRescheduled } = await import('./resend');
        const dateStr = new Date(date).toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        await sendAppointmentRescheduled({
          clientName: appointment.name, clientEmail: appointment.email,
          date: dateStr, startTime, endTime, platform: appointment.platform,
        });
      } catch (emailErr: any) { console.error('Reschedule email failed:', emailErr.message); }
      res.json({ success: true, appointment });
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      res.status(500).json({ message: 'Failed to reschedule appointment' });
    }
  });

  // Availability routes
  app.post(api.availability.create.path, async (req, res) => {
    try {
      // Explicit date guard before Zod parsing
      const rawDate = req.body?.date;
      if (!rawDate) {
        return res.status(400).json({ message: "Le champ 'date' est requis.", field: "date" });
      }
      const parsedDate = new Date(rawDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: `Valeur de date invalide: ${rawDate}`, field: "date" });
      }
      const input = api.availability.create.input.parse(req.body);
      console.log(`[Slots] Creating — date=${input.date instanceof Date ? input.date.toISOString() : input.date} start=${input.startTime} end=${input.endTime}`);
      const slot = await storage.createAvailabilitySlot(input);
      console.log(`[Slots] Created — id=${slot.id} date=${slot.date}`);
      res.status(201).json(slot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Slots] Error creating slot:', msg);
      res.status(500).json({ message: `Impossible d'ajouter le créneau: ${msg}` });
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

  app.delete('/api/admin/appointments/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteAppointment(id);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting appointment:', err);
      res.status(500).json({ message: err?.message ?? 'Failed to delete appointment' });
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


  // ── AI Chat ──────────────────────────────────────────────────────────────────

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'messages array required' });
      }
      const { generateChatResponse } = await import('./gemini');
      const reply = await generateChatResponse(messages);
      res.json({ reply });
    } catch (err: any) {
      console.error('[Chat] Error:', err.message);
      res.status(500).json({ message: err.message || 'Chat error' });
    }
  });

  app.post('/api/chat/lead', async (req, res) => {
    try {
      const { email, summary } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'email required' });
      }
      const { pool } = await import('./db');
      await pool.query(
        'INSERT INTO leads (email, summary) VALUES ($1, $2)',
        [email.trim().toLowerCase(), summary ?? null]
      );
      try {
        const { sendLeadNotification } = await import('./resend');
        await sendLeadNotification({ email: email.trim(), summary: summary ?? '' });
      } catch (emailErr: any) {
        console.error('[Chat Lead] Email error (non-fatal):', emailErr.message);
      }
      res.json({ success: true });
    } catch (err: any) {
      console.error('[Chat Lead] Error:', err.message);
      res.status(500).json({ message: err.message || 'Lead capture error' });
    }
  });

  // Diagnostic — returns exact Resend error so we can debug production failures
  // Protected by ADMIN_PASSWORD to prevent abuse
  app.post('/api/debug/resend-test', async (req, res) => {
    const { password } = req.body ?? {};
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const key = process.env.RESEND_API_KEY;
    if (!key) return res.status(500).json({ message: 'RESEND_API_KEY not set' });

    try {
      const { Resend } = await import('resend');
      const client = new Resend(key);
      const r = await client.emails.send({
        from: 'AudreyRH <info@audreyrh.com>',
        to: 'info@audreyrh.com',
        subject: 'Diagnostic test',
        html: '<p>Diagnostic test from server</p>',
      });
      res.json({ success: !r.error, data: r.data, error: r.error, keyPrefix: key.slice(0, 8) });
    } catch (err: any) {
      res.json({ success: false, threw: err.message, keyPrefix: key.slice(0, 8) });
    }
  });

  return httpServer;
}
