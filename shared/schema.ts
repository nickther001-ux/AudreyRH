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
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
