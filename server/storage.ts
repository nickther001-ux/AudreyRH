import { db } from "./db";
import {
  appointments,
  type InsertAppointment,
  type Appointment
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment>;
}

export class DatabaseStorage implements IStorage {
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment;
  }

  async updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ 
        paymentStatus: "paid",
        stripePaymentIntentId: paymentIntentId 
      })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }
}

export const storage = new DatabaseStorage();
