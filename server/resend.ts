import { Resend } from 'resend';

const FROM = 'AudreyRH <info@audreyrh.com>';
const NOTIFY_TO = 'info@audreyrh.com';

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

// ─── Booking confirmation ────────────────────────────────────────────────────

export type AppointmentEmailData = {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  platform: string;
  reason: string;
};

export async function sendBookingConfirmation(data: AppointmentEmailData) {
  const client = getClient();
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange =
    data.startTime && data.endTime ? `${data.startTime} – ${data.endTime} (HE)` : '';

  const clientHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Confirmation de réservation — AudreyRH</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);padding:40px 48px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">AudreyRH</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-transform:uppercase;">Conseillère en ressources humaines agréée · CRIA</p>
          </td>
        </tr>
        <!-- Success band -->
        <tr>
          <td style="background:#16a34a;padding:16px 48px;text-align:center;">
            <p style="margin:0;font-size:15px;font-weight:600;color:#fff;">✅ &nbsp;Paiement confirmé — Votre consultation est réservée</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:48px;">
            <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1e3a5f;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
              Merci pour votre confiance ! Votre consultation avec <strong>Audrey Mondesir, CRIA</strong> est confirmée. Voici un récapitulatif :
            </p>
            <!-- Details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:10px;margin-bottom:32px;">
              <tr><td style="padding:28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${data.date ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br/>
                    <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${data.date}</span>
                  </td></tr>` : ''}
                  ${timeRange ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Heure</span><br/>
                    <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${timeRange}</span>
                  </td></tr>` : ''}
                  <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Plateforme</span><br/>
                    <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${platformLabel}</span>
                  </td></tr>
                  <tr><td style="padding:10px 0;">
                    <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Sujet</span><br/>
                    <span style="font-size:15px;color:#1e3a5f;">${data.reason}</span>
                  </td></tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.7;">
              Audrey vous enverra le lien ${platformLabel} <strong>24 à 48 heures avant</strong> votre rendez-vous.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
              Pour toute question : <a href="mailto:info@audreyrh.com" style="color:#c87941;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;"/>
            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
              AudreyRH · info@audreyrh.com · Montréal, Québec, Canada<br/>
              <em>Tous les paiements sont finaux — aucun remboursement.</em>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const notifyHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;padding:32px;">
  <div style="background:#fff;border-radius:10px;padding:32px;max-width:500px;margin:auto;border:1px solid #e2e8f0;">
    <h2 style="color:#1e3a5f;margin:0 0 20px;">🗓 Nouvelle réservation confirmée</h2>
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:100px;">Client</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${data.clientName}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Courriel</td><td style="padding:8px 0;"><a href="mailto:${data.clientEmail}" style="color:#c87941;">${data.clientEmail}</a></td></tr>
      ${data.date ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Date</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${data.date}</td></tr>` : ''}
      ${timeRange ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Heure</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${timeRange}</td></tr>` : ''}
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Plateforme</td><td style="padding:8px 0;">${platformLabel}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top;">Sujet</td><td style="padding:8px 0;color:#1e3a5f;">${data.reason}</td></tr>
    </table>
  </div>
</body></html>`;

  console.log('[Resend] Sending booking emails to:', data.clientEmail);
  const [r1, r2] = await Promise.all([
    client.emails.send({ from: FROM, to: data.clientEmail, subject: 'Confirmation de votre consultation — AudreyRH', html: clientHtml }),
    client.emails.send({ from: FROM, to: NOTIFY_TO, subject: `[AudreyRH] Nouvelle réservation — ${data.clientName}`, html: notifyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Booking client email error:', JSON.stringify(r1.error));
  else console.log('[Resend] Booking client email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Booking notify email error:', JSON.stringify(r2.error));
  else console.log('[Resend] Booking notify email sent, id:', r2.data?.id);
  if (r1.error && r2.error) throw new Error(`Both booking emails failed: ${r1.error.message}`);
}

// ─── Contact / grant application ────────────────────────────────────────────

export type ContactEmailData = {
  name: string;
  email: string;
  grantType: string;
  projectDescription: string;
};

const grantTypeLabel: Record<string, string> = {
  artists: 'Artistes / Créateurs',
  entrepreneurs: 'Entrepreneurs',
  sme: 'PME / Entreprises établies',
  corporate: 'Grandes entreprises',
  other: 'Autre',
};

export async function sendContactEmails(data: ContactEmailData) {
  const client = getClient();
  const typeLabel = grantTypeLabel[data.grantType] ?? data.grantType;

  // 1 — Internal lead notification
  const notifyHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;padding:32px;">
  <div style="background:#fff;border-radius:10px;padding:32px;max-width:560px;margin:auto;border:1px solid #e2e8f0;">
    <h2 style="color:#1e3a5f;margin:0 0 20px;">📬 Nouvelle demande de contact</h2>
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:130px;">Nom</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${data.name}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Courriel</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#c87941;">${data.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Type de projet</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${typeLabel}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top;">Description</td><td style="padding:8px 0;color:#334155;line-height:1.6;">${data.projectDescription.replace(/\n/g, '<br/>')}</td></tr>
    </table>
  </div>
</body></html>`;

  // 2 — Bilingual auto-reply to client
  const replyHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Merci — AudreyRH</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);padding:40px 48px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">AudreyRH</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-transform:uppercase;">Conseillère en ressources humaines agréée · CRIA</p>
          </td>
        </tr>
        <!-- Copper accent band -->
        <tr>
          <td style="background:#c87941;padding:14px 48px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#fff;letter-spacing:0.3px;">Merci pour votre message · Thank you for reaching out</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:48px;">

            <!-- French section -->
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e3a5f;">Bonjour ${data.name},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.7;">
              Merci de nous avoir contactés ! Nous avons bien reçu votre demande concernant <strong>${typeLabel}</strong> et nous vous répondrons dans les <strong>24 à 48 heures</strong>.
            </p>
            <div style="background:#f1f5f9;border-left:4px solid #1e3a5f;border-radius:0 8px 8px 0;padding:18px 24px;margin-bottom:28px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Votre message</p>
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${data.projectDescription.replace(/\n/g, '<br/>')}</p>
            </div>
            <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
              En attendant, vous pouvez réserver directement une consultation en ligne sur <a href="https://audreyrh.com/book" style="color:#c87941;font-weight:600;text-decoration:none;">audreyrh.com/book</a>.
            </p>

            <!-- Divider -->
            <hr style="border:none;border-top:2px dashed #e2e8f0;margin:32px 0;"/>

            <!-- English section -->
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#1e3a5f;">Hello ${data.name},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.7;">
              Thank you for reaching out! We have received your inquiry regarding <strong>${typeLabel}</strong> and will get back to you within <strong>24 to 48 hours</strong>.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
              In the meantime, you can book a consultation directly at <a href="https://audreyrh.com/book" style="color:#c87941;font-weight:600;text-decoration:none;">audreyrh.com/book</a>.
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;"/>
            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.8;">
              AudreyRH · <a href="mailto:info@audreyrh.com" style="color:#94a3b8;">info@audreyrh.com</a><br/>
              Montréal, Québec, Canada<br/>
              <a href="https://audreyrh.com" style="color:#c87941;text-decoration:none;">audreyrh.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  console.log('[Resend] Sending contact emails — notify + reply to:', data.email);
  const [r1, r2] = await Promise.all([
    client.emails.send({ from: FROM, to: NOTIFY_TO, subject: `[AudreyRH] Nouvelle demande — ${data.name} (${typeLabel})`, html: notifyHtml }),
    client.emails.send({ from: FROM, to: data.email, subject: 'Merci pour votre demande — AudreyRH / Thank you for reaching out', html: replyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Contact notify email error:', JSON.stringify(r1.error));
  else console.log('[Resend] Contact notify email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Contact auto-reply email error:', JSON.stringify(r2.error));
  else console.log('[Resend] Contact auto-reply email sent, id:', r2.data?.id);
  if (r1.error && r2.error) throw new Error(`Both contact emails failed: ${r1.error.message}`);
}
