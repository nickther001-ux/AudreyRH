import { google } from "googleapis";
import { randomUUID } from "crypto";

// Calendar scope for creating events
const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar",
];

// Google Meet API scope for creating meeting spaces (no DWD required)
const MEET_SCOPES = [
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
  startDateTime: string;
  endDateTime: string;
  platform?: string;
}

function parseServiceAccountCreds(): { clientEmail: string; privateKey: string } {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    return { clientEmail: parsed.client_email, privateKey: parsed.private_key };
  }
  throw new Error(
    "Google auth not configured. Set GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY, or GOOGLE_SERVICE_ACCOUNT_JSON."
  );
}

/**
 * Create a unique Google Meet link using the Google Meet REST API v2.
 * This does NOT require domain-wide delegation — works with any service account.
 */
async function createMeetSpace(): Promise<string> {
  const { clientEmail, privateKey } = parseServiceAccountCreds();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: MEET_SCOPES,
  });

  const token = await auth.authorize();
  const accessToken = token.access_token;
  if (!accessToken) throw new Error("Failed to get access token for Meet API");

  const res = await fetch("https://meet.googleapis.com/v2/spaces", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Meet API error ${res.status}: ${body}`);
  }

  const data = await res.json() as { meetingUri?: string; meetingCode?: string; name?: string };
  const meetLink = data.meetingUri ?? "";
  console.log(`[GoogleMeet] Meet space created: ${meetLink}`);
  return meetLink;
}

/**
 * Create a Google Calendar event (without Meet conferencing).
 * Returns the calendar event htmlLink and eventId.
 */
async function createCalendarEvent(params: CreateMeetEventParams): Promise<{ eventId: string; htmlLink: string }> {
  const calendarId = 'audreycria31@gmail.com';

  const { clientEmail, privateKey } = parseServiceAccountCreds();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: CALENDAR_SCOPES,
  });

  const calendar = google.calendar({ version: "v3", auth });

  const ZOOM_LINK = 'https://us05web.zoom.us/j/3617510198?pwd=5Yto7YKwJpfF1TxIecDzSTJbiwaCZu.1';

  const requestBody: Record<string, any> = {
    summary: params.summary,
    description: params.description,
    start: { dateTime: params.startDateTime, timeZone: "America/Toronto" },
    end: { dateTime: params.endDateTime, timeZone: "America/Toronto" },
  };

  if (params.platform?.toLowerCase() === 'zoom') {
    requestBody.location = ZOOM_LINK;
    requestBody.description =
      `Audrey RH is inviting you to a scheduled Zoom meeting.\n\n` +
      `Topic: Audrey RH's Personal Meeting Room\n` +
      `Join Zoom Meeting\n${ZOOM_LINK}\n\n` +
      `Meeting ID: 361 751 0198\n` +
      `Passcode: nTa2sG\n\n` +
      (params.description || '');
    delete requestBody.conferenceData;
    console.log('[GoogleMeet] Platform is Zoom — Google Meet bypassed, Zoom link injected.');
  }

  const event = await calendar.events.insert({
    calendarId,
    requestBody,
  });

  console.log(`[GoogleMeet] Calendar event created: ${event.data.id}`);
  return { eventId: event.data.id ?? "", htmlLink: event.data.htmlLink ?? "" };
}

export async function createGoogleMeetEvent(
  params: CreateMeetEventParams
): Promise<GoogleMeetResult> {
  const ZOOM_LINK = 'https://us05web.zoom.us/j/3617510198?pwd=5Yto7YKwJpfF1TxIecDzSTJbiwaCZu.1';
  const isZoom = params.platform?.toLowerCase() === 'zoom';

  // 1. Resolve meeting link — skip Google Meet entirely for Zoom bookings
  let meetLink = "";
  if (isZoom) {
    meetLink = ZOOM_LINK;
    console.log('[GoogleMeet] Platform is Zoom — skipping Google Meet space creation.');
  } else {
    try {
      meetLink = await createMeetSpace();
    } catch (meetErr: any) {
      console.warn(`[GoogleMeet] Meet API failed, falling back to static link. Reason: ${meetErr.message}`);
      meetLink = process.env.GOOGLE_MEET_LINK ?? "";
    }
  }

  // 2. Create the calendar event (best-effort, non-blocking)
  let eventId = "";
  let htmlLink = "";
  try {
    const calResult = await createCalendarEvent(params);
    eventId = calResult.eventId;
    htmlLink = calResult.htmlLink;
  } catch (calErr: any) {
    console.warn(`[GoogleMeet] Calendar event creation failed (non-fatal): ${calErr.message}`);
  }

  console.log(`[GoogleMeet] Resolved meeting link: ${meetLink}`);
  return { meetLink, eventId, htmlLink };
}
