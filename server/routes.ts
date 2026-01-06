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
                unit_amount: 5000,
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

  return httpServer;
}
