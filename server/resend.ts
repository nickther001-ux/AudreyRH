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

  // 1 — Internal lead notification to Audrey
  const notifyHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Nouveau Lead — AudreyRH</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- ── Header ── -->
        <tr>
          <td style="background:#1e293b;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background:#f97316;height:4px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:28px 40px;">
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">AudreyRH · Notification interne</p>
                  <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">🔔 Nouveau lead entrant</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Lead badge ── -->
        <tr>
          <td style="padding:28px 40px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 18px;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#ea580c;">
                    ${typeLabel}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Fields ── -->
        <tr>
          <td style="padding:24px 40px 32px;">

            <!-- Name -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Nom</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">${data.name}</p>
                </td>
              </tr>
            </table>

            <!-- Email — reply-to prompt -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Courriel · Répondre directement</p>
                  <p style="margin:0;">
                    <a href="mailto:${data.email}" style="font-size:16px;font-weight:700;color:#f97316;text-decoration:none;">${data.email}</a>
                    <span style="font-size:12px;color:#94a3b8;margin-left:8px;">(appuyer sur Répondre)</span>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Project type -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Type de projet</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">${typeLabel}</p>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:16px 20px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Message</p>
                  <p style="margin:0;font-size:14px;color:#334155;line-height:1.75;">${data.projectDescription.replace(/\n/g, '<br/>')}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── CTA ── -->
        <tr>
          <td style="padding:0 40px 36px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1e293b;border-radius:8px;">
                  <a href="mailto:${data.email}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Répondre à ${data.name} →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              AudreyRH · Notification automatique · <a href="https://audreyrh.com" style="color:#f97316;text-decoration:none;">audreyrh.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // 2 — Premium bilingual auto-reply to client
  const replyHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Merci de votre intérêt — AudreyRH</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

        <!-- ── Header ── -->
        <tr>
          <td style="background:#1e293b;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <!-- Orange top stripe -->
              <tr><td style="background:#f97316;height:4px;font-size:0;">&nbsp;</td></tr>
              <!-- Logo row -->
              <tr>
                <td style="padding:36px 48px 28px;text-align:center;">
                  <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-1px;">
                    Audrey<span style="color:#f97316;">RH</span><span style="color:#f97316;">.</span>
                  </p>
                  <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:2px;text-transform:uppercase;">
                    Conseillère en ressources humaines agréée &nbsp;·&nbsp; CRIA
                  </p>
                </td>
              </tr>
              <!-- Confirmation band -->
              <tr>
                <td style="padding:0 48px 36px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.35);border-radius:100px;">
                    <tr>
                      <td style="padding:10px 24px;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#f97316;letter-spacing:0.3px;">
                          ✔&nbsp;&nbsp;Message reçu · Message received
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="padding:48px;">

            <!-- FR greeting -->
            <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#1e293b;">Bonjour ${data.name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.75;">
              Merci de nous avoir contactés. Votre demande concernant
              <strong style="color:#1e293b;">${typeLabel}</strong>
              a bien été reçue et nous vous répondrons sous
              <strong style="color:#1e293b;">24 à 48 heures ouvrables</strong>.
            </p>

            <!-- Message recap box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #f97316;border-radius:0 10px 10px 0;padding:20px 24px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Votre message / Your message</p>
                  <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${data.projectDescription.replace(/\n/g, '<br/>')}</p>
                </td>
              </tr>
            </table>

            <!-- FR CTA -->
            <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.75;">
              En attendant notre réponse, vous pouvez réserver une consultation directement en ligne :
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
              <tr>
                <td style="background:#f97316;border-radius:8px;">
                  <a href="https://audreyrh.com/book" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">
                    Réserver une consultation →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 36px;">
              <tr>
                <td style="border-top:1px solid #e2e8f0;font-size:0;">&nbsp;</td>
              </tr>
            </table>

            <!-- EN greeting -->
            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#1e293b;">Hello ${data.name},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.75;">
              Thank you for getting in touch. We have received your inquiry about
              <strong style="color:#1e293b;">${typeLabel}</strong>
              and will respond within
              <strong style="color:#1e293b;">24 to 48 business hours</strong>.
            </p>
            <p style="margin:0 0 40px;font-size:15px;color:#64748b;line-height:1.75;">
              In the meantime, feel free to book a consultation at
              <a href="https://audreyrh.com/book" style="color:#f97316;font-weight:600;text-decoration:none;">audreyrh.com/book</a>.
            </p>

          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#1e293b;padding:28px 48px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.9);font-weight:600;">AudreyRH</p>
            <p style="margin:0 0 12px;font-size:12px;color:rgba(255,255,255,0.45);">
              Montréal, Québec, Canada &nbsp;·&nbsp;
              <a href="mailto:info@audreyrh.com" style="color:rgba(255,255,255,0.45);text-decoration:none;">info@audreyrh.com</a> &nbsp;·&nbsp;
              <a href="https://audreyrh.com" style="color:#f97316;text-decoration:none;">audreyrh.com</a>
            </p>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
              Tous les paiements sont finaux — aucun remboursement. · All payments are final — no refunds.
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
    client.emails.send({ from: FROM, to: NOTIFY_TO, replyTo: data.email, subject: `🔔 Nouveau Lead : ${data.name} (${typeLabel})`, html: notifyHtml }),
    client.emails.send({ from: FROM, to: data.email, subject: `Merci de votre intérêt / Thank you for your interest — AudreyRH`, html: replyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Contact notify email error:', JSON.stringify(r1.error));
  else console.log('[Resend] Contact notify email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Contact auto-reply email error:', JSON.stringify(r2.error));
  else console.log('[Resend] Contact auto-reply email sent, id:', r2.data?.id);
  if (r1.error && r2.error) throw new Error(`Both contact emails failed: ${r1.error.message}`);
}
