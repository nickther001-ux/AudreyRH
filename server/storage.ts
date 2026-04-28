import { db, pool } from "./db";
import {
  appointments,
  availabilitySlots,
  type InsertAppointment,
  type Appointment,
  type InsertAvailabilitySlot,
  type AvailabilitySlot
} from "@shared/schema";
import { eq, gte, and, isNotNull } from "drizzle-orm";

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: "confirmed" | "cancelled" | "completed" | "pending"): Promise<Appointment>;
  setMeetLink(id: number, meetLink: string): Promise<void>;
  rescheduleAppointment(id: number, date: Date, startTime: string, endTime: string): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  // Availability
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  getAvailableSlots(): Promise<AvailabilitySlot[]>;
  getAdminSlots(): Promise<AvailabilitySlot[]>;
  getAvailabilitySlot(id: number): Promise<AvailabilitySlot | undefined>;
  deleteAvailabilitySlot(id: number): Promise<void>;
  bookSlot(id: number): Promise<AvailabilitySlot | null>;
  unbookSlot(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    // Use raw SQL to avoid any Drizzle ORM schema compilation issues
    // that could cause wrong column names in the compiled production bundle.
    let dateString: string | null = null;
    if (insertAppointment.date) {
      const raw = new Date(insertAppointment.date as unknown as string | Date);
      if (!isNaN(raw.getTime())) {
        const y = raw.getUTCFullYear();
        const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
        const d = String(raw.getUTCDate()).padStart(2, "0");
        dateString = `${y}-${m}-${d}`;
      }
    }
    console.log(`[Appointment] Inserting date="${dateString}" for ${insertAppointment.email}`);
    const { rows } = await pool.query<Appointment>(
      `INSERT INTO appointments
         (name, email, phone, reason, date, slot_id, start_time, end_time, platform, appointment_type, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING
         id, name, email, phone, reason, date::text AS date,
         slot_id AS "slotId", start_time AS "startTime", end_time AS "endTime",
         platform, appointment_type AS "appointmentType",
         status, payment_status AS "paymentStatus",
         stripe_payment_intent_id AS "stripePaymentIntentId",
         meet_link AS "meetLink",
         language,
         was_rescheduled AS "wasRescheduled",
         created_at AS "createdAt"`,
      [
        insertAppointment.name,
        insertAppointment.email,
        insertAppointment.phone ?? null,
        insertAppointment.reason,
        dateString,
        insertAppointment.slotId ?? null,
        insertAppointment.startTime ?? null,
        insertAppointment.endTime ?? null,
        insertAppointment.platform ?? "zoom",
        insertAppointment.appointmentType ?? "paid_service",
        insertAppointment.language ?? "fr",
      ]
    );
    return rows[0];
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
    // slot.date is a Date (coerced by Zod). Extract yyyy-MM-dd string to avoid
    // Drizzle's .toISOString() serializer which produces "T...Z" that PostgreSQL
    // TIMESTAMP WITHOUT TIME ZONE silently nulls. DATE column accepts plain strings.
    const raw = new Date(slot.date);
    if (isNaN(raw.getTime())) {
      throw new Error(`Invalid date value received: ${slot.date}`);
    }
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    const dateString = `${y}-${m}-${d}`;
    console.log(`[Slots] Inserting date="${dateString}" start=${slot.startTime} end=${slot.endTime}`);
    const [created] = await db
      .insert(availabilitySlots)
      .values({ date: dateString, startTime: slot.startTime, endTime: slot.endTime })
      .returning();
    if (!created.date) {
      throw new Error(`DB insert returned null date — slot id=${created.id}.`);
    }
    return created;
  }

  async getAvailableSlots(): Promise<AvailabilitySlot[]> {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    const todayString = `${y}-${m}-${d}`;
    const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Cross-check against appointments table so that a slot with a stale
    // isBooked flag is still hidden from the frontend.
    // Explicitly block slots that have a Pending OR Confirmed booking —
    // using an IN allowlist so NULL-status legacy rows are never treated as free.
    const { rows } = await pool.query<AvailabilitySlot>(`
      SELECT
        s.id,
        s.date::text        AS date,
        s.start_time        AS "startTime",
        s.end_time          AS "endTime",
        s.is_booked         AS "isBooked"
      FROM availability_slots s
      WHERE s.is_booked = false
        AND s.date IS NOT NULL
        AND s.date::text >= $1
        AND NOT EXISTS (
          SELECT 1 FROM appointments a
          WHERE a.date        = s.date
            AND a.start_time  = s.start_time
            AND a.status IN ('pending', 'confirmed', 'completed')
        )
      ORDER BY s.date, s.start_time
    `, [todayString]);

    const timeToMinutes = (t: string): number => {
      const [h, min] = t.split(":").map(Number);
      return h * 60 + min;
    };

    return rows.filter(slot => {
      if (slot.date === todayString) {
        return timeToMinutes(slot.startTime) > currentMinutes;
      }
      return true;
    });
  }

  async getAdminSlots(): Promise<AvailabilitySlot[]> {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    const todayString = `${y}-${m}-${d}`;
    // Exclude slots that already have a pending, confirmed, or completed appointment
    // so taken time slots are automatically removed from the admin calendar view.
    const { rows } = await pool.query<AvailabilitySlot>(`
      SELECT
        s.id,
        s.date::text  AS date,
        s.start_time  AS "startTime",
        s.end_time    AS "endTime",
        s.is_booked   AS "isBooked"
      FROM availability_slots s
      WHERE s.date IS NOT NULL
        AND s.date::text >= $1
        AND NOT EXISTS (
          SELECT 1 FROM appointments a
          WHERE a.date       = s.date
            AND a.start_time = s.start_time
            AND a.status IN ('pending', 'confirmed', 'completed')
        )
      ORDER BY s.date, s.start_time
    `, [todayString]);
    return rows;
  }

  async getAvailabilitySlot(id: number): Promise<AvailabilitySlot | undefined> {
    const [slot] = await db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.id, id));
    return slot;
  }

  async deleteAppointment(id: number): Promise<void> {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
  }

  async deleteAvailabilitySlot(id: number): Promise<void> {
    await db
      .delete(availabilitySlots)
      .where(eq(availabilitySlots.id, id));
  }

  async updateAppointmentStatus(id: number, status: "confirmed" | "cancelled" | "completed" | "pending"): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async setMeetLink(id: number, meetLink: string): Promise<void> {
    await pool.query(
      'UPDATE appointments SET meet_link = $1, status = $2 WHERE id = $3',
      [meetLink, 'confirmed', id]
    );
  }

  async rescheduleAppointment(id: number, date: Date, startTime: string, endTime: string): Promise<Appointment> {
    const raw = new Date(date);
    const y = raw.getUTCFullYear();
    const mo = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    const dateString = `${y}-${mo}-${d}`;
    const { rows } = await pool.query<Appointment>(
      `UPDATE appointments
       SET date = $1, start_time = $2, end_time = $3, status = 'confirmed', was_rescheduled = true
       WHERE id = $4
       RETURNING
         id, name, email, phone, reason, date::text AS date,
         slot_id AS "slotId", start_time AS "startTime", end_time AS "endTime",
         platform, appointment_type AS "appointmentType",
         status, payment_status AS "paymentStatus",
         stripe_payment_intent_id AS "stripePaymentIntentId",
         meet_link AS "meetLink",
         language,
         was_rescheduled AS "wasRescheduled",
         created_at AS "createdAt"`,
      [dateString, startTime, endTime, id]
    );
    return rows[0];
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
