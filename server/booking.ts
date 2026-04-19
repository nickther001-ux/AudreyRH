import { storage } from "./storage";
import { createGoogleMeetEvent } from "./googleMeet";
import { sendMeetConfirmation } from "./resend";

export interface BookingDetails {
  appointmentId: number;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  platform: string;
  reason: string;
  amount?: string;
  stripeId?: string;
  language?: "fr" | "en";
}

function buildDateTime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`;
}

export async function processBooking(
  clientName: string,
  clientEmail: string,
  details: BookingDetails
): Promise<{ meetLink: string }> {
  let meetLink = process.env.GOOGLE_MEET_LINK ?? "";

  if (details.date && details.startTime && details.endTime) {
    try {
      const startDateTime = buildDateTime(details.date, details.startTime);
      const endDateTime = buildDateTime(details.date, details.endTime);

      const result = await createGoogleMeetEvent({
        summary: `Consultation AudreyRH — ${clientName}`,
        description: `Consultation stratégique avec ${clientName} (${clientEmail})\nSujet : ${details.reason}`,
        startDateTime,
        endDateTime,
      });

      meetLink = result.meetLink;
      console.log(`[Booking] Google Meet event created for appointment #${details.appointmentId}: ${meetLink}`);
    } catch (calErr: any) {
      console.error(`[Booking] Google Calendar error (non-fatal, using fallback link): ${calErr.message}`);
    }
  } else {
    console.log(`[Booking] No date/time for appointment #${details.appointmentId} — skipping calendar event`);
  }

  await storage.setMeetLink(details.appointmentId, meetLink);

  try {
    await sendMeetConfirmation({
      clientName,
      clientEmail,
      meetLink,
      date: details.date ?? "",
      startTime: details.startTime,
      endTime: details.endTime,
      platform: details.platform,
      reason: details.reason,
      amount: details.amount,
      stripeId: details.stripeId,
      language: details.language ?? "fr",
    });
  } catch (emailErr: any) {
    console.error(`[Booking] Resend email error (non-fatal): ${emailErr.message}`);
  }

  return { meetLink };
}
