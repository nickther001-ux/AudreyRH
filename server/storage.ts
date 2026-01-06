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
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment>;
  // Availability
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  getAvailableSlots(): Promise<AvailabilitySlot[]>;
  getAvailabilitySlot(id: number): Promise<AvailabilitySlot | undefined>;
  deleteAvailabilitySlot(id: number): Promise<void>;
  bookSlot(id: number): Promise<AvailabilitySlot | null>;
  unbookSlot(id: number): Promise<void>;
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

  async getAllAppointments(): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .orderBy(appointments.createdAt);
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all unbooked slots from today onwards
    const slots = await db
      .select()
      .from(availabilitySlots)
      .where(and(
        eq(availabilitySlots.isBooked, false),
        gte(availabilitySlots.date, today)
      ))
      .orderBy(availabilitySlots.date);
    
    // Convert time string (HH:MM or H:MM) to minutes since midnight for comparison
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return slots.filter(slot => {
      const slotDate = new Date(slot.date);
      const isSameDay = slotDate.getFullYear() === now.getFullYear() && 
                        slotDate.getMonth() === now.getMonth() && 
                        slotDate.getDate() === now.getDate();
      
      // If same day, only show slots that haven't started yet
      if (isSameDay) {
        const slotStartMinutes = timeToMinutes(slot.startTime);
        return slotStartMinutes > currentMinutes;
      }
      return true;
    });
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

  async bookSlot(id: number): Promise<AvailabilitySlot | null> {
    // Only book if not already booked (atomic operation)
    const [slot] = await db
      .update(availabilitySlots)
      .set({ isBooked: true })
      .where(and(
        eq(availabilitySlots.id, id),
        eq(availabilitySlots.isBooked, false)
      ))
      .returning();
    return slot || null;
  }

  async unbookSlot(id: number): Promise<void> {
    await db
      .update(availabilitySlots)
      .set({ isBooked: false })
      .where(eq(availabilitySlots.id, id));
  }
}

export const storage = new DatabaseStorage();
