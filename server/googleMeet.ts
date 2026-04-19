import { google } from "googleapis";
import { randomUUID } from "crypto";

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
  startDateTime: string;
  endDateTime: string;
}

function getAuthClient() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set.");
  }

  let clientEmail: string;
  let privateKey: string;

  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    clientEmail = parsed.client_email;
    privateKey = parsed.private_key;
  } else {
    throw new Error(
      "Google auth not configured. Set GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY, or GOOGLE_SERVICE_ACCOUNT_JSON."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return { auth, calendarId };
}

export async function createGoogleMeetEvent(
  params: CreateMeetEventParams
): Promise<GoogleMeetResult> {
  const { auth, calendarId } = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const requestId = randomUUID();

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime,
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: params.endDateTime,
        timeZone: "America/Toronto",
      },
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const eventData = event.data;

  const entryPoints = eventData.conferenceData?.entryPoints ?? [];
  const videoEntry = entryPoints.find((e) => e.entryPointType === "video");
  const meetLink =
    videoEntry?.uri ??
    eventData.hangoutLink ??
    eventData.htmlLink ??
    process.env.GOOGLE_MEET_LINK ??
    "";

  console.log(`[GoogleMeet] Event created: ${eventData.id}, Meet link: ${meetLink}`);

  return {
    meetLink,
    eventId: eventData.id ?? "",
    htmlLink: eventData.htmlLink ?? "",
  };
}
