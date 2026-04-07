import { Resend } from 'resend';

const FROM = 'AudreyRH <info@audreyrh.com>';
const NOTIFY_TO = 'info@audreyrh.com';

// ─── Brand palette (used across all email templates) ─────────────────────────
// BG_OUTER  #0d1f3c  — deep navy page wrapper
// BG_CARD   #1e3a5f  — midnight blue card
// BG_FIELD  rgba(255,255,255,0.07) — input/field rows
// BG_FOOTER #0a1628  — ultra-dark navy footer
// BORDER    rgba(255,255,255,0.12)
// TEXT      #ffffff
// TEXT_MUTE rgba(255,255,255,0.65)
// TEXT_LABEL rgba(255,255,255,0.45)
// ACCENT    #f97316  — orange
// ACCENT2   #93c5fd  — light blue
// GREEN     #4ade80

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

// ─── Shared snippets ─────────────────────────────────────────────────────────

const emailWrapperOpen = (width = 600) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0d1f3c;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1f3c;padding:48px 0;">
    <tr><td align="center">
      <table width="${width}" cellpadding="0" cellspacing="0" style="background:#1e3a5f;border-radius:16px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,0.5);">`;

const emailWrapperClose = `
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const logoHeader = (badge?: string) => `
        <tr>
          <td style="background:#0d1f3c;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background:#f97316;height:4px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:32px 48px 20px;text-align:center;">
                  <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-1px;">
                    Audrey<span style="color:#f97316;">RH</span><span style="color:#f97316;">.</span>
                  </p>
                  <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;">
                    Conseillère en ressources humaines agréée &nbsp;·&nbsp; CRIA
                  </p>
                </td>
              </tr>
              ${badge ? `<tr>
                <td style="padding:0 48px 28px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.4);border-radius:100px;">
                    <tr><td style="padding:10px 24px;">
                      <p style="margin:0;font-size:13px;font-weight:600;color:#f97316;">${badge}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>` : ''}
            </table>
          </td>
        </tr>`;

const compactHeader = (eyebrow: string, title: string) => `
        <tr>
          <td style="background:#0d1f3c;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background:#f97316;height:4px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:24px 32px 24px;">
                  <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;">${eyebrow}</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${title}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

const fieldRow = (label: string, value: string, last = false) =>
  `<tr><td style="padding:10px 0;${last ? '' : 'border-bottom:1px solid rgba(255,255,255,0.1);'}">
    <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">${label}</span><br/>
    <span style="font-size:15px;font-weight:600;color:#ffffff;">${value}</span>
  </td></tr>`;

const fieldBox = (label: string, value: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
    <tr><td style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 18px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">${label}</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${value}</p>
    </td></tr>
  </table>`;

const emailFooter = (extra?: string) => `
        <tr>
          <td style="background:#0a1628;padding:22px 48px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:700;">AudreyRH</p>
            <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.35);">
              Montréal, Québec, Canada &nbsp;·&nbsp;
              <a href="mailto:info@audreyrh.com" style="color:rgba(255,255,255,0.35);text-decoration:none;">info@audreyrh.com</a> &nbsp;·&nbsp;
              <a href="https://audreyrh.com" style="color:#f97316;text-decoration:none;">audreyrh.com</a>
            </p>
            ${extra ? `<p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">${extra}</p>` : ''}
          </td>
        </tr>`;

const ctaButton = (href: string, label: string, color = '#f97316') =>
  `<table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:${color};border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:13px 30px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;

// ─── Booking confirmation (paid) ─────────────────────────────────────────────

export type AppointmentEmailData = {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  platform: string;
  reason: string;
  amount?: string;
  stripeId?: string;
};

export async function sendBookingConfirmation(data: AppointmentEmailData) {
  const client = getClient();
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange = data.startTime && data.endTime ? `${data.startTime} – ${data.endTime} (HE)` : '';
  const amountDisplay = data.amount ?? '85.00';
  const stripeIdDisplay = data.stripeId ?? '—';

  // 1 — Client confirmation
  const clientHtml = `${emailWrapperOpen(600)}
${logoHeader('✅&nbsp;&nbsp;Paiement confirmé — Consultation réservée')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#ffffff;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              Merci pour votre paiement / Thank you for your payment.<br/>
              Votre consultation avec <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong> est confirmée.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;">
              <tr><td style="padding:22px 26px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${data.date ? fieldRow('Date', data.date) : ''}
                  ${timeRange ? fieldRow('Heure / Time', timeRange) : ''}
                  ${fieldRow('Plateforme', platformLabel)}
                  ${data.reason ? fieldRow('Sujet / Subject', data.reason, true) : ''}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.2);border-radius:10px;padding:22px 26px;">
                  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#ffffff;">📋 Préparation / Preparation</p>
                  ${[
                    ['FR: Ayez vos états financiers ou documents d\'incorporation prêts.', 'EN: Have your financial statements or incorporation docs ready.'],
                    ['FR: Notez vos 3 défis RH prioritaires.', 'EN: Note your top 3 priority HR challenges.'],
                    ['FR: Assurez-vous d\'avoir une connexion internet stable.', 'EN: Ensure you have a stable internet connection.'],
                  ].map(([fr, en]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                    <tr>
                      <td width="26" valign="top" style="padding-top:1px;">
                        <span style="display:inline-block;width:18px;height:18px;background:#f97316;border-radius:50%;text-align:center;line-height:18px;font-size:10px;font-weight:700;color:#fff;">✓</span>
                      </td>
                      <td>
                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">
                          <strong style="color:#ffffff;">${fr.replace('FR: ', 'FR: ')}</strong><br/>
                          <em style="color:rgba(255,255,255,0.45);">${en.replace('EN: ', 'EN: ')}</em>
                        </p>
                      </td>
                    </tr>
                  </table>`).join('')}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7;">
              Le lien ${platformLabel} vous sera envoyé <strong style="color:#ffffff;">24 à 48 heures avant</strong> votre rendez-vous.
            </p>
            <p style="margin:0 0 32px;font-size:14px;color:rgba(255,255,255,0.65);">
              Questions ? <a href="mailto:info@audreyrh.com" style="color:#f97316;font-weight:600;text-decoration:none;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter('Tous les paiements sont finaux — aucun remboursement. · All payments are final — no refunds.')}
${emailWrapperClose}`;

  // 2 — Internal notification to Audrey
  const notifyHtml = `${emailWrapperOpen(500)}
${compactHeader('AudreyRH · Paiement reçu', '💰 Nouveau Paiement Reçu')}
        <tr>
          <td style="padding:28px 32px 32px;">
            <div style="margin-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Client</p>
              <p style="margin:0;font-size:16px;color:#ffffff;">
                ${data.clientName}
                <a href="mailto:${data.clientEmail}" style="font-size:14px;color:#f97316;text-decoration:none;margin-left:6px;">(${data.clientEmail})</a>
              </p>
            </div>
            <div style="margin-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Montant / Amount</p>
              <p style="margin:0;font-size:26px;font-weight:800;color:#4ade80;">$${amountDisplay} CAD</p>
            </div>
            ${data.date ? `<div style="margin-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Date${timeRange ? ' & Heure' : ''}</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${data.date}${timeRange ? ' · ' + timeRange : ''}</p>
            </div>` : ''}
            <div style="margin-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Plateforme</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${platformLabel}</p>
            </div>
            <div style="margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Transaction ID</p>
              <code style="font-size:13px;background:rgba(255,255,255,0.1);padding:4px 10px;border-radius:4px;color:#93c5fd;">${stripeIdDisplay}</code>
            </div>
            <hr style="border:0;border-top:1px solid rgba(255,255,255,0.1);margin:0 0 24px;"/>
            ${ctaButton('https://audreyrh.com/admin', 'Voir dans le tableau de bord →')}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log('[Resend] Sending booking emails to:', data.clientEmail);
  const [r1, r2] = await Promise.all([
    client.emails.send({ from: FROM, to: data.clientEmail, subject: 'Confirmation de votre consultation — AudreyRH', html: clientHtml }),
    client.emails.send({ from: FROM, to: NOTIFY_TO, replyTo: data.clientEmail, subject: `💰 Nouveau Paiement : ${data.clientName} — $${amountDisplay} CAD`, html: notifyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Booking client email error:', JSON.stringify(r1.error));
  else console.log('[Resend] Booking client email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Booking notify email error:', JSON.stringify(r2.error));
  else console.log('[Resend] Booking notify email sent, id:', r2.data?.id);
  if (r1.error && r2.error) throw new Error(`Both booking emails failed: ${r1.error.message}`);
}

// ─── Free Consultation Request ───────────────────────────────────────────────

export type FreeConsultationData = {
  clientName: string;
  clientEmail: string;
  phone?: string | null;
  preferredDate: string;
  preferredTime: string;
  platform: string;
  reason: string;
};

export async function sendFreeConsultationRequest(data: FreeConsultationData) {
  const client = getClient();
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeDisplay = data.preferredTime || '—';

  // 1 — Internal notification to Audrey
  const notifyHtml = `${emailWrapperOpen(520)}
${compactHeader('AudreyRH · Demande de consultation', '📅 Nouvelle demande — À CONFIRMER')}
        <tr>
          <td style="padding:28px 32px 32px;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr><td style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);border-radius:8px;padding:10px 18px;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#fbbf24;">⏳ Statut : EN ATTENTE — Veuillez confirmer ou refuser</p>
              </td></tr>
            </table>

            ${fieldBox('Client', `${data.clientName} <a href="mailto:${data.clientEmail}" style="color:#f97316;text-decoration:none;">(${data.clientEmail})</a>${data.phone ? ' · ' + data.phone : ''}`)}
            ${fieldBox('Date souhaitée', `${data.preferredDate} · ${timeDisplay}`)}
            ${fieldBox('Plateforme', platformLabel)}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:rgba(255,255,255,0.07);border:1px solid rgba(147,197,253,0.3);border-left:4px solid #93c5fd;border-radius:0 10px 10px 0;padding:16px 20px;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Message</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.75;">${data.reason.replace(/\n/g, '<br/>')}</p>
              </td></tr>
            </table>

            ${ctaButton(`mailto:${data.clientEmail}`, `Répondre à ${data.clientName} →`)}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  // 2 — Client acknowledgement (pending)
  const clientHtml = `${emailWrapperOpen(600)}
${logoHeader('📩&nbsp;&nbsp;Demande reçue — Confirmation sous 48h')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#ffffff;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              Merci pour votre demande de consultation gratuite.<br/>
              <em style="color:rgba(255,255,255,0.45);">Thank you for your free consultation request.</em><br/><br/>
              Votre demande a bien été reçue. <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong> vous confirmera la date dans les <strong style="color:#f97316;">24 à 48 heures ouvrables</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;">
              <tr><td style="padding:22px 26px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow('Date souhaitée / Preferred Date', data.preferredDate)}
                  ${fieldRow('Heure / Time', timeDisplay)}
                  ${fieldRow('Plateforme', platformLabel)}
                  ${fieldRow('Statut / Status', '<span style="color:#fbbf24;">⏳ En attente de confirmation / Pending confirmation</span>', true)}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#fbbf24;">ℹ️ Important</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;">
                  <strong style="color:#ffffff;">FR :</strong> Cette demande n'est pas encore confirmée. Vous recevrez un email de confirmation d'Audrey avec le lien de connexion.<br/>
                  <em style="color:rgba(255,255,255,0.5);">EN: This request is not yet confirmed. You will receive a confirmation email from Audrey with the meeting link.</em>
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.65);">
              Questions ? <a href="mailto:info@audreyrh.com" style="color:#f97316;font-weight:600;text-decoration:none;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log('[Resend] Sending free consultation request emails for:', data.clientEmail);
  const [r1, r2] = await Promise.all([
    client.emails.send({ from: FROM, to: data.clientEmail, subject: 'Demande de consultation reçue — AudreyRH', html: clientHtml }),
    client.emails.send({ from: FROM, to: NOTIFY_TO, replyTo: data.clientEmail, subject: `📅 Nouvelle demande gratuite : ${data.clientName} — ${data.preferredDate}`, html: notifyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Free consult client email error:', JSON.stringify(r1.error));
  if (r2.error) console.error('[Resend] Free consult notify email error:', JSON.stringify(r2.error));
  if (r1.error && r2.error) throw new Error(`Both free consultation emails failed`);
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
  const notifyHtml = `${emailWrapperOpen(560)}
${compactHeader('AudreyRH · Notification interne', '🔔 Nouveau lead entrant')}
        <tr>
          <td style="padding:24px 36px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr><td style="background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.35);border-radius:8px;padding:10px 18px;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#f97316;">${typeLabel}</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;">
            ${fieldBox('Nom', data.name)}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr><td style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:14px 18px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Courriel · Répondre directement</p>
                <p style="margin:0;">
                  <a href="mailto:${data.email}" style="font-size:15px;font-weight:700;color:#f97316;text-decoration:none;">${data.email}</a>
                  <span style="font-size:12px;color:rgba(255,255,255,0.35);margin-left:8px;">(appuyer sur Répondre)</span>
                </p>
              </td></tr>
            </table>
            ${fieldBox('Type de projet', typeLabel)}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:rgba(255,255,255,0.07);border:1px solid rgba(147,197,253,0.3);border-left:4px solid #93c5fd;border-radius:0 10px 10px 0;padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Message</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.75;">${data.projectDescription.replace(/\n/g, '<br/>')}</p>
              </td></tr>
            </table>
            ${ctaButton(`mailto:${data.email}`, `Répondre à ${data.name} →`)}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  // 2 — Bilingual auto-reply to client
  const replyHtml = `${emailWrapperOpen(600)}
${logoHeader('✔&nbsp;&nbsp;Message reçu · Message received')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#ffffff;">Bonjour ${data.name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              Merci de nous avoir contactés. Votre demande concernant
              <strong style="color:#f97316;">${typeLabel}</strong>
              a bien été reçue et nous vous répondrons sous
              <strong style="color:#ffffff;">24 à 48 heures ouvrables</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:rgba(255,255,255,0.07);border:1px solid rgba(147,197,253,0.3);border-left:4px solid #93c5fd;border-radius:0 10px 10px 0;padding:20px 24px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Votre message / Your message</p>
                  <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;">${data.projectDescription.replace(/\n/g, '<br/>')}</p>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:24px 28px;">
                  <p style="margin:0 0 18px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1.2px;border-bottom:2px solid #f97316;padding-bottom:10px;display:inline-block;">
                    Préparation &nbsp;/&nbsp; Preparation
                  </p>
                  ${[
                    ['Documents', 'CV à jour, lettres de refus, offres d\'emploi pertinentes', 'Updated CV, rejection letters, relevant job postings'],
                    ['Objectifs / Goals', 'Notez vos 2–3 priorités pour cette consultation', 'Write down your 2–3 priorities for this session'],
                    ['Environnement / Environment', 'Endroit calme, connexion stable, caméra fonctionnelle', 'Quiet space, stable connection, working camera'],
                  ].map(([title, fr, en]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                    <tr>
                      <td width="28" valign="top" style="padding-top:1px;">
                        <span style="display:inline-block;width:20px;height:20px;background:#f97316;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#fff;">✓</span>
                      </td>
                      <td>
                        <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#ffffff;">${title}</p>
                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
                          ${fr}<br/>
                          <em style="color:rgba(255,255,255,0.4);">${en}</em>
                        </p>
                      </td>
                    </tr>
                  </table>`).join('')}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              En attendant notre réponse, vous pouvez réserver une consultation directement en ligne :
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
              ${ctaButton('https://audreyrh.com/book', 'Réserver une consultation →')}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
              <tr><td style="border-top:1px solid rgba(255,255,255,0.1);font-size:0;">&nbsp;</td></tr>
            </table>

            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#ffffff;">Hello ${data.name},</p>
            <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              Thank you for getting in touch. We have received your inquiry about
              <strong style="color:#f97316;">${typeLabel}</strong>
              and will respond within
              <strong style="color:#ffffff;">24 to 48 business hours</strong>.
            </p>
            <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">
              In the meantime, feel free to book a consultation at
              <a href="https://audreyrh.com/book" style="color:#f97316;font-weight:600;text-decoration:none;">audreyrh.com/book</a>.
            </p>
          </td>
        </tr>
${emailFooter('Tous les paiements sont finaux — aucun remboursement. · All payments are final — no refunds.')}
${emailWrapperClose}`;

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
