import { pgTable, text, serial, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  reason: text("reason").notNull(),
  date: timestamp("date").notNull(),
  slotId: integer("slot_id"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  platform: text("platform", { enum: ["zoom", "google_meet"] }).default("zoom").notNull(),
  appointmentType: text("appointment_type", { enum: ["free_consultation", "paid_service"] }).default("paid_service").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] }).default("pending").notNull(),
  paymentStatus: text("payment_status", { enum: ["unpaid", "paid"] }).default("unpaid").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isBooked: boolean("is_booked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export {
  insertAppointmentSchema,
  insertAvailabilitySlotSchema,
  type InsertAppointment,
  type Appointment,
  type InsertAvailabilitySlot,
  type AvailabilitySlot,
} from "./validators";
