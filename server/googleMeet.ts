import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

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
      `Google service account key not found at ${KEY_PATH}. ` +
      `Place your service account JSON file at server/keys/google-service-account.json`
    );
  }

  const keyFile = JSON.parse(fs.readFileSync(KEY_PATH, "utf-8"));

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error(
      "GOOGLE_CALENDAR_ID environment variable is not set. " +
      "Set it to the Google email of the calendar shared with the service account."
    );
  }

  // No subject — service account authenticates as itself and accesses the shared calendar
  // by its calendarId. The calendar must have granted the service account write permissions.
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
    conferenceDataVersion: 1,
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
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const eventData = event.data;

  const meetLink =
    eventData.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri ??
    eventData.hangoutLink ??
    "";

  if (!meetLink) {
    throw new Error(
      "Google Meet link was not generated. Ensure the calendar owner has allowed " +
      "Google Meet on their calendar and the service account has write access."
    );
  }

  return {
    meetLink,
    eventId: eventData.id ?? "",
    htmlLink: eventData.htmlLink ?? "",
  };
}
