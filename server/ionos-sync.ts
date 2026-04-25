import https from "https";
import { randomUUID } from "crypto";

const CALDAV_BASE = "https://dav.messaging.ionos.com";

function formatICSDate(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

function escapeICS(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildVEvent(opts: {
  uid: string;
  summary: string;
  description: string;
  dtstart: string;
  dtend: string;
  organizer: string;
}): string {
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AudreyRH//CalDAV Sync//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Toronto:${opts.dtstart}`,
    `DTEND;TZID=America/Toronto:${opts.dtend}`,
    `SUMMARY:${escapeICS(opts.summary)}`,
    `DESCRIPTION:${escapeICS(opts.description)}`,
    `ORGANIZER:mailto:${opts.organizer}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function makeAuthHeader(): string {
  const email = process.env.IONOS_EMAIL ?? "";
  const password = process.env.IONOS_PASSWORD ?? "";
  return "Basic " + Buffer.from(`${email}:${password}`).toString("base64");
}

async function discoverCalendarHome(): Promise<string | null> {
  const email = process.env.IONOS_EMAIL ?? "";
  const propfindBody = `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <c:calendar-home-set/>
  </d:prop>
</d:propfind>`;

  const principalPath = `/principals/${encodeURIComponent(email)}/`;

  return new Promise((resolve) => {
    const url = new URL(CALDAV_BASE + principalPath);
    const body = Buffer.from(propfindBody, "utf-8");

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "PROPFIND",
        headers: {
          Authorization: makeAuthHeader(),
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Length": body.length,
          Depth: "0",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const match = data.match(/<[^>]*:?href[^>]*>([^<]+calendar[^<]*)<\/[^>]*:?href>/i);
          if (match) {
            resolve(match[1].trim());
          } else {
            resolve(`/caldav/v1/${encodeURIComponent(email)}/calendar/`);
          }
        });
      }
    );
    req.on("error", () => {
      resolve(`/caldav/v1/${encodeURIComponent(email)}/calendar/`);
    });
    req.write(body);
    req.end();
  });
}

function putEvent(calendarPath: string, uid: string, icsBody: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = new URL(CALDAV_BASE + calendarPath + uid + ".ics");
    const body = Buffer.from(icsBody, "utf-8");

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "PUT",
        headers: {
          Authorization: makeAuthHeader(),
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Length": body.length,
        },
      },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function syncToIonos(opts: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  meetLink?: string | null;
  reason?: string | null;
}): Promise<void> {
  const email = process.env.IONOS_EMAIL;
  const password = process.env.IONOS_PASSWORD;

  if (!email || !password) {
    console.warn("[IONOS] IONOS_EMAIL or IONOS_PASSWORD not set — skipping CalDAV sync");
    return;
  }

  const uid = `audreyrh-${randomUUID()}`;
  const dtstart = formatICSDate(opts.date, opts.startTime);
  const dtend = formatICSDate(opts.date, opts.endTime);

  const platformLabel = opts.platform === "google_meet" ? "Google Meet" : "Zoom";
  const link = opts.meetLink ?? (opts.platform === "google_meet"
    ? process.env.GOOGLE_MEET_LINK ?? ""
    : "https://us05web.zoom.us/j/3617510198?pwd=5Yto7YKwJpfF1TxIecDzSTJbiwaCZu.1");

  const description = [
    `Client : ${opts.clientName}`,
    `Email : ${opts.clientEmail}`,
    opts.clientPhone ? `Téléphone : ${opts.clientPhone}` : null,
    opts.reason ? `Motif : ${opts.reason}` : null,
    `Plateforme : ${platformLabel}`,
    `Lien : ${link}`,
  ]
    .filter(Boolean)
    .join("\n");

  const summary = `${opts.clientName} - Consultation AudreyRH`;

  const icsBody = buildVEvent({ uid, summary, description, dtstart, dtend, organizer: email });

  try {
    const calendarPath = await discoverCalendarHome();
    const finalPath = calendarPath?.endsWith("/") ? calendarPath : (calendarPath ?? "") + "/";
    const statusCode = await putEvent(finalPath, uid, icsBody);

    if (statusCode >= 200 && statusCode < 300) {
      console.log(`[IONOS] Event synced successfully (${statusCode}): ${uid}`);
    } else {
      console.warn(`[IONOS] Unexpected status ${statusCode} when syncing event ${uid}`);
    }
  } catch (err: any) {
    console.error("[IONOS] CalDAV sync failed (non-fatal):", err.message);
  }
}
