import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_FILE_PATH = path.join(process.cwd(), "server", "keys", "google-service-account.json");

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

function loadKeyFile(): { client_email: string; private_key: string } {
  if (fs.existsSync(KEY_FILE_PATH)) {
    return JSON.parse(fs.readFileSync(KEY_FILE_PATH, "utf-8"));
  }
  const envJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (envJson) {
    return JSON.parse(envJson);
  }
  throw new Error(
    "No Google service account credentials found. Provide server/keys/google-service-account.json or set GOOGLE_SERVICE_ACCOUNT_JSON."
  );
}

function getAuthClient() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set.");
  }

  const keyFile = loadKeyFile();

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
      location: process.env.GOOGLE_MEET_LINK ?? "Zoom / Google Meet (lien envoyé par courriel)",
    },
  });

  const eventData = event.data;
  const meetLink = process.env.GOOGLE_MEET_LINK ?? eventData.htmlLink ?? "";

  return {
    meetLink,
    eventId: eventData.id ?? "",
    htmlLink: eventData.htmlLink ?? "",
  };
}
