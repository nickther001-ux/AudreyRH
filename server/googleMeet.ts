import { google } from "googleapis";

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
  const envJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!envJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set.");
  }
  return JSON.parse(envJson);
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
