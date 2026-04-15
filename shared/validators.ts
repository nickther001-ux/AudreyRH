import { z } from "zod";

export const insertAppointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  date: z.coerce.date().optional(),
  slotId: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  platform: z.enum(["zoom", "google_meet"]).default("zoom"),
  appointmentType: z.enum(["free_consultation", "paid_service", "business_consultation"]).default("paid_service"),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export const insertAvailabilitySlotSchema = z.object({
  date: z.coerce.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
}).refine((data) => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;

export type Appointment = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  reason: string;
  date: string | null;
  slotId: number | null;
  startTime: string | null;
  endTime: string | null;
  platform: "zoom" | "google_meet";
  appointmentType: "free_consultation" | "paid_service" | "business_consultation";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  stripePaymentIntentId: string | null;
  wasRescheduled: boolean;
  createdAt: Date;
};

export type AvailabilitySlot = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: Date;
};
