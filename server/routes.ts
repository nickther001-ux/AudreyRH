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
          success_url: `${req.protocol}://${req.get('host')}/book?success=true&appointmentId=${appointment.id}`,
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

  // Admin password verification endpoint
  app.post('/api/admin/verify-password', async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        return res.status(500).json({ success: false, message: 'Admin password not configured' });
      }
      
      if (password === adminPassword) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (err) {
      console.error('Error verifying admin password:', err);
      res.status(500).json({ success: false, message: 'Verification failed' });
    }
  });

  return httpServer;
}
