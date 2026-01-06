import { db } from "./db";
import {
  appointments,
  availabilitySlots,
  type InsertAppointment,
  type Appointment,
  type InsertAvailabilitySlot,
  type AvailabilitySlot
} from "@shared/schema";
import { eq, gte, and } from "drizzle-orm";

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment>;
  // Availability
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  getAvailableSlots(): Promise<AvailabilitySlot[]>;
  getAvailabilitySlot(id: number): Promise<AvailabilitySlot | undefined>;
  deleteAvailabilitySlot(id: number): Promise<void>;
  bookSlot(id: number): Promise<AvailabilitySlot>;
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

  async createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const [created] = await db
      .insert(availabilitySlots)
      .values(slot)
      .returning();
    return created;
  }

  async getAvailableSlots(): Promise<AvailabilitySlot[]> {
    const now = new Date();
    return db
      .select()
      .from(availabilitySlots)
      .where(and(
        eq(availabilitySlots.isBooked, false),
        gte(availabilitySlots.date, now)
      ))
      .orderBy(availabilitySlots.date);
  }

  async getAvailabilitySlot(id: number): Promise<AvailabilitySlot | undefined> {
    const [slot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, id));
    return slot;
  }

  async deleteAvailabilitySlot(id: number): Promise<void> {
    await db
      .delete(availabilitySlots)
      .where(eq(availabilitySlots.id, id));
  }

  async bookSlot(id: number): Promise<AvailabilitySlot> {
    const [slot] = await db
      .update(availabilitySlots)
      .set({ isBooked: true })
      .where(eq(availabilitySlots.id, id))
      .returning();
    return slot;
  }
}

export const storage = new DatabaseStorage();
