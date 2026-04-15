import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_PATH = path.join(process.cwd(), "server", "keys", "google-service-account.json");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar",
];

export interface GoogleMeetResult {
  meetLink: string;
  eventId: string;
  htmlLink: string;
}

export interface CreateMeetEventParams {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendeeEmail?: string;
}

function getAuthClient() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(
      `Google service account key not found at ${KEY_PATH}.`
    );
  }

  const keyFile = JSON.parse(fs.readFileSync(KEY_PATH, "utf-8"));

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error(
      "GOOGLE_CALENDAR_ID environment variable is not set."
    );
  }

  const auth = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes: SCOPES,
  });

  return { auth, calendarId };
}

export async function createGoogleMeetEvent(
  params: CreateMeetEventParams
): Promise<GoogleMeetResult> {
  const { auth, calendarId } = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  // Create the calendar event without conferenceData (works with personal Gmail)
  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: params.endTime,
        timeZone: "America/Toronto",
      },
      // Use the GOOGLE_MEET_LINK env var if set (a pre-created standing Meet room).
      // This is the reliable approach for personal Gmail accounts since the Calendar API
      // conferenceData.createRequest only works with Google Workspace accounts.
      location: process.env.GOOGLE_MEET_LINK ?? "Zoom / Google Meet (lien envoyé par courriel)",
    },
  });

  const eventData = event.data;

  // Return the standing Meet link from env, or fall back to the calendar event URL
  const meetLink = process.env.GOOGLE_MEET_LINK ?? eventData.htmlLink ?? "";

  return {
    meetLink,
    eventId: eventData.id ?? "",
    htmlLink: eventData.htmlLink ?? "",
  };
}
