import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const KEY_PATH = path.join(process.cwd(), "server", "keys", "google-service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

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

  const auth = new google.auth.JWT({
    email: keyFile.client_email,
    key: keyFile.private_key,
    scopes: SCOPES,
  });

  return auth;
}

export async function createGoogleMeetEvent(
  params: CreateMeetEventParams
): Promise<GoogleMeetResult> {
  const auth = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const attendees = params.attendeeEmail
    ? [{ email: params.attendeeEmail }]
    : [];

  const event = await calendar.events.insert({
    calendarId: "primary",
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
      attendees,
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
    )?.uri ?? eventData.hangoutLink ?? "";

  if (!meetLink) {
    throw new Error(
      "Google Meet link was not generated. Ensure the Google Calendar API has Meet integration enabled " +
      "and the service account has calendar access."
    );
  }

  return {
    meetLink,
    eventId: eventData.id ?? "",
    htmlLink: eventData.htmlLink ?? "",
  };
}
