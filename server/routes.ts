import type { Express } from "express";
import { createServer, type Server } from "http";
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
      
      // TODO: Initialize Stripe Payment Intent here
      // const paymentIntent = await stripe.paymentIntents.create({...})
      const clientSecret = "mock_secret"; // Placeholder until stripe is integrated

      res.status(201).json({ appointment, clientSecret });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
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

  return httpServer;
}
