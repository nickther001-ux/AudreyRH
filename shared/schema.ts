import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  reason: text("reason").notNull(),
  date: timestamp("date").notNull(),
  platform: text("platform", { enum: ["zoom", "google_meet"] }).default("zoom").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] }).default("pending").notNull(),
  paymentStatus: text("payment_status", { enum: ["unpaid", "paid"] }).default("unpaid").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ 
  id: true, 
  status: true,
  paymentStatus: true,
  stripePaymentIntentId: true,
  createdAt: true 
}).extend({
  date: z.coerce.date().min(new Date(), "Date must be in the future"),
  email: z.string().email("Invalid email address"),
  platform: z.enum(["zoom", "google_meet"]).default("zoom"),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Availability slots - Audrey's available time blocks
export const availabilitySlots = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(), // Format: "09:00"
  endTime: text("end_time").notNull(), // Format: "10:00"
  isBooked: boolean("is_booked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({
  id: true,
  isBooked: true,
  createdAt: true,
}).extend({
  date: z.coerce.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;
