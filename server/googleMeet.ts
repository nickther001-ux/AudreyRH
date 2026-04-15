import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_PATH = path.join(process.cwd(), "server", "keys", "google-service-account.json");

const SCOPES = [
  "https://www.googleapis.com/auth/meetings.space.created",
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
  const meet = google.meet({ version: "v2", auth });

  const space = await meet.spaces.create({ requestBody: {} });

  const meetLink = space.data.meetingUri ?? "";

  if (!meetLink) {
    throw new Error(
      "Google Meet link was not returned. Ensure the Meet API is enabled in Google Cloud Console " +
      "and the service account has the meetings.space.created scope."
    );
  }

  return {
    meetLink,
    eventId: space.data.name ?? "",
    htmlLink: meetLink,
  };
}
