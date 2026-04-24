import { Resend } from 'resend';
import ics from 'ics';

const FROM = '"Services RH" <info@audreyrh.com>';
const REPLY_TO = 'info@audreyrh.com';
const NOTIFY_TO = 'info@audreyrh.com';

// ─── Brand palette ───────────────────────────────────────────────────────────
// BG_OUTER  #0d1f3c  — deep navy page wrapper
// BG_CARD   #1e3a5f  — midnight blue card
// BG_FIELD  rgba(255,255,255,0.07)
// BG_FOOTER #0a1628
// BORDER    rgba(255,255,255,0.12)
// TEXT      #ffffff
// TEXT_MUTE rgba(255,255,255,0.65)
// TEXT_DIM  rgba(255,255,255,0.40)
// ACCENT    #93c5fd  — steel blue
// GREEN     #4ade80  — payment amount only

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|tr|li|h[1-6]|table|thead|tbody|tfoot|section|article|header|footer)[^>]*>/gi, '\n')
    .replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_: string, href: string, text: string) => {
      const t = text.replace(/<[^>]+>/g, '').trim();
      return t ? `${t} (${href})` : href;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

type EmailPayload = Parameters<Resend['emails']['send']>[0];

async function sendEmail(resendClient: Resend, payload: EmailPayload) {
  const enriched: EmailPayload = {
    replyTo: REPLY_TO,
    ...payload,
    from: FROM,
    text: (payload as any).text ?? ((payload as any).html ? htmlToText((payload as any).html) : undefined),
  };
  return resendClient.emails.send(enriched);
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

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
              <tr><td style="background:rgba(255,255,255,0.06);height:1px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:32px 48px 20px;text-align:center;">
                  <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-1px;">
                    Audrey<span style="color:#ffffff;">RH</span><span style="color:#93c5fd;">.</span>
                  </p>
                  <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:2.5px;text-transform:uppercase;">
                    Conseillère en ressources humaines agréée &nbsp;·&nbsp; CRIA
                  </p>
                </td>
              </tr>
              ${badge ? `<tr>
                <td style="padding:0 48px 28px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:100px;">
                    <tr><td style="padding:9px 22px;">
                      <p style="margin:0;font-size:12px;font-weight:600;color:#ffffff;letter-spacing:0.3px;">${badge}</p>
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
              <tr><td style="background:rgba(255,255,255,0.06);height:1px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:24px 32px 24px;">
                  <p style="margin:0 0 5px;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:2.5px;text-transform:uppercase;">${eyebrow}</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${title}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

const fieldRow = (label: string, value: string, last = false) =>
  `<tr><td style="padding:10px 0;${last ? '' : 'border-bottom:1px solid rgba(255,255,255,0.08);'}">
    <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">${label}</span><br/>
    <span style="font-size:15px;font-weight:600;color:#ffffff;">${value}</span>
  </td></tr>`;

const fieldBox = (label: string, value: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);border-radius:10px;padding:14px 18px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">${label}</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${value}</p>
    </td></tr>
  </table>`;

const emailFooter = (extra?: string) => `
        <tr>
          <td style="background:#0a1628;padding:22px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0 0 5px;font-size:12px;color:rgba(255,255,255,0.7);font-weight:700;letter-spacing:0.5px;">AudreyRH</p>
            <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.3);">
              Montréal, Québec, Canada &nbsp;·&nbsp;
              <a href="mailto:info@audreyrh.com" style="color:rgba(255,255,255,0.3);text-decoration:none;">info@audreyrh.com</a> &nbsp;·&nbsp;
              <a href="https://audreyrh.com" style="color:#93c5fd;text-decoration:none;">audreyrh.com</a>
            </p>
            ${extra ? `<p style="margin:0;font-size:10px;color:rgba(255,255,255,0.18);">${extra}</p>` : ''}
          </td>
        </tr>`;

const ctaButton = (href: string, label: string) =>
  `<table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.22);border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:13px 30px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">${label}</a>
      </td>
    </tr>
  </table>`;

const checkBullet = `<span style="display:inline-block;width:18px;height:18px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:50%;text-align:center;line-height:16px;font-size:9px;font-weight:700;color:#ffffff;">✓</span>`;

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
${logoHeader('✓&nbsp;&nbsp;Paiement confirmé — Consultation réservée')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:23px;font-weight:700;color:#ffffff;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.8;">
              Merci pour votre paiement / Thank you for your payment.<br/>
              Votre consultation avec <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong> est confirmée.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${data.date ? fieldRow('Date', data.date) : ''}
                  ${timeRange ? fieldRow('Heure / Time', timeRange) : ''}
                  ${fieldRow('Plateforme', platformLabel)}
                  ${data.reason ? fieldRow('Sujet / Subject', data.reason, true) : ''}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">Préparation / Preparation</p>
                  ${[
                    ['FR: Ayez vos états financiers ou documents d\'incorporation prêts.', 'EN: Have your financial statements or incorporation docs ready.'],
                    ['FR: Notez vos 3 défis RH prioritaires.', 'EN: Note your top 3 priority HR challenges.'],
                    ['FR: Assurez-vous d\'avoir une connexion internet stable.', 'EN: Ensure you have a stable internet connection.'],
                  ].map(([fr, en]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                    <tr>
                      <td width="26" valign="top" style="padding-top:1px;">${checkBullet}</td>
                      <td>
                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.65;">
                          ${fr}<br/><em style="color:rgba(255,255,255,0.35);">${en}</em>
                        </p>
                      </td>
                    </tr>
                  </table>`).join('')}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.75;">
              Le lien ${platformLabel} vous sera envoyé <strong style="color:#ffffff;">24 à 48 heures avant</strong> votre rendez-vous.
            </p>
            <p style="margin:0 0 32px;font-size:13px;color:rgba(255,255,255,0.55);">
              Questions ? <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter('Tous les paiements sont finaux — aucun remboursement. · All payments are final — no refunds.')}
${emailWrapperClose}`;

  // 2 — Internal notification to Audrey
  const notifyHtml = `${emailWrapperOpen(500)}
${compactHeader('AudreyRH · Paiement reçu', 'Nouveau paiement reçu')}
        <tr>
          <td style="padding:28px 32px 32px;">
            <div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Client</p>
              <p style="margin:0;font-size:15px;color:#ffffff;">
                ${data.clientName}
                <a href="mailto:${data.clientEmail}" style="font-size:13px;color:#93c5fd;text-decoration:none;margin-left:6px;">${data.clientEmail}</a>
              </p>
            </div>
            <div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Montant / Amount</p>
              <p style="margin:0;font-size:26px;font-weight:800;color:#4ade80;">$${amountDisplay} CAD</p>
            </div>
            ${data.date ? `<div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Date${timeRange ? ' & Heure' : ''}</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${data.date}${timeRange ? ' · ' + timeRange : ''}</p>
            </div>` : ''}
            <div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Plateforme</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${platformLabel}</p>
            </div>
            <div style="margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Transaction ID</p>
              <code style="font-size:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);padding:4px 10px;border-radius:4px;color:#93c5fd;">${stripeIdDisplay}</code>
            </div>
            <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 22px;"/>
            ${ctaButton('https://audreyrh.com/admin', 'Voir dans le tableau de bord →')}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log('[Resend] Sending booking emails to:', data.clientEmail);
  const [r1, r2] = await Promise.all([
    sendEmail(client, { from: FROM, to: data.clientEmail, subject: 'Confirmation de votre consultation — AudreyRH', html: clientHtml }),
    sendEmail(client, { from: FROM, to: NOTIFY_TO, replyTo: data.clientEmail, subject: `Nouveau paiement : ${data.clientName} — $${amountDisplay} CAD`, html: notifyHtml }),
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
  meetLink?: string;
};

export async function sendFreeConsultationRequest(data: FreeConsultationData) {
  const client = getClient();
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeDisplay = data.preferredTime || '—';
  const isZoom = data.platform !== 'google_meet';
  const hasMeetLink = !!(data.meetLink && data.meetLink.startsWith('http'));

  // 1 — Internal notification to Audrey (shows the link so she can reference it when confirming)
  const notifyHtml = `${emailWrapperOpen(520)}
${compactHeader('AudreyRH · Demande de consultation', 'Nouvelle demande — À confirmer')}
        <tr>
          <td style="padding:24px 32px 0;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
              <tr><td style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);border-radius:8px;padding:10px 18px;">
                <p style="margin:0;font-size:12px;font-weight:600;color:rgba(255,255,255,0.8);">En attente — Veuillez confirmer ou refuser cette demande</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 32px 32px;">
            ${fieldBox('Client', `${data.clientName} &nbsp;<a href="mailto:${data.clientEmail}" style="color:#93c5fd;text-decoration:none;font-weight:600;">${data.clientEmail}</a>${data.phone ? ' &nbsp;· ' + data.phone : ''}`)}
            ${fieldBox('Date souhaitée', `${data.preferredDate} · ${timeDisplay}`)}
            ${fieldBox('Plateforme', platformLabel)}
            ${hasMeetLink ? fieldBox('Lien de réunion (sera envoyé au client à la confirmation)', `<a href="${data.meetLink}" style="color:#4ade80;text-decoration:none;">${data.meetLink}</a>${isZoom ? '<br/><span style="font-size:11px;color:rgba(255,255,255,0.4);">Meeting ID: 361 751 0198 · Passcode: nTa2sG</span>' : ''}`) : ''}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:rgba(255,255,255,0.05);border:1px solid rgba(147,197,253,0.2);border-left:3px solid #93c5fd;border-radius:0 10px 10px 0;padding:14px 18px;">
                <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Message</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);line-height:1.75;">${data.reason.replace(/\n/g, '<br/>')}</p>
              </td></tr>
            </table>
            ${ctaButton(`mailto:${data.clientEmail}`, `Répondre à ${data.clientName} →`)}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  // 2 — Client acknowledgement (PENDING — no meeting link, just receipt confirmation)
  const clientHtml = `${emailWrapperOpen(600)}
${logoHeader('Demande reçue — Confirmation sous 48h')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:23px;font-weight:700;color:#ffffff;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.8;">
              Merci pour votre demande de consultation gratuite.<br/>
              <em style="color:rgba(255,255,255,0.35);">Thank you for your free consultation request.</em><br/><br/>
              Votre demande a bien été reçue. <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong> vous confirmera la date dans les <strong style="color:#ffffff;">24 à 48 heures ouvrables</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow('Date souhaitée / Preferred Date', data.preferredDate)}
                  ${fieldRow('Heure / Time', timeDisplay)}
                  ${fieldRow('Plateforme', platformLabel)}
                  ${fieldRow('Statut / Status', 'En attente de confirmation / Pending confirmation', true)}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:18px 22px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);">Note importante</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.75;">
                  Cette demande n'est pas encore confirmée. Vous recevrez un email de confirmation d'Audrey avec le lien ${platformLabel} dès approbation.<br/>
                  <em style="color:rgba(255,255,255,0.35);">This request is not yet confirmed. You will receive a confirmation email from Audrey with the ${platformLabel} link upon approval.</em>
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.55);">
              Questions ? <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log('[Resend] Sending free consultation request emails for:', data.clientEmail);
  const [r1, r2] = await Promise.all([
    sendEmail(client, { from: FROM, to: data.clientEmail, subject: 'Demande de consultation reçue — AudreyRH', html: clientHtml }),
    sendEmail(client, { from: FROM, to: NOTIFY_TO, replyTo: data.clientEmail, subject: `Nouvelle demande de consultation : ${data.clientName} — ${data.preferredDate}`, html: notifyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Free consult client email error:', JSON.stringify(r1.error));
  if (r2.error) console.error('[Resend] Free consult notify email error:', JSON.stringify(r2.error));
  if (r1.error && r2.error) throw new Error(`Both free consultation emails failed`);
}

// ─── AI Chat Lead Notification ───────────────────────────────────────────────

export async function sendLeadNotification(data: { email: string; summary: string; segment?: string | null; primary_goal?: string | null }) {
  const client = getClient();

  const segmentMap: Record<string, { label: string; color: string }> = {
    Business:        { label: '🏢 Entreprise',           color: '#93c5fd' },
    Individual:      { label: '👤 Particulier',          color: '#4ade80' },
    'Hybrid-Artist': { label: '🎨 Hybride — Artiste',   color: '#f59e0b' },
    'Hybrid-Founder':{ label: '🚀 Hybride — Fondateur', color: '#a78bfa' },
  };
  const seg = data.segment ? segmentMap[data.segment] : null;
  const segmentLabel = seg?.label ?? '❓ Non identifié';
  const segmentColor = seg?.color ?? 'rgba(255,255,255,0.4)';
  const goalLabel = data.primary_goal ?? '—';

  // Build a clean 2-sentence summary from the raw transcript
  const userLines = (data.summary || '')
    .split('\n')
    .filter(l => l.startsWith('Visiteur:'))
    .map(l => l.replace('Visiteur:', '').trim())
    .filter(Boolean);
  const briefSummary = userLines.slice(0, 2).join(' ') || data.summary?.slice(0, 300) || '';

  const html = `${emailWrapperOpen(520)}
${compactHeader('AudreyRH · Chat IA — Amara', 'Nouveau lead capturé via le chat')}
        <tr>
          <td style="padding:24px 32px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr><td style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:8px;padding:10px 18px;">
                <p style="margin:0;font-size:13px;font-weight:700;color:${segmentColor};">${segmentLabel}</p>
              </td></tr>
            </table>
            ${fieldBox('Email du prospect', `<a href="mailto:${data.email}" style="color:#93c5fd;text-decoration:none;">${data.email}</a>`)}
            ${fieldBox('Objectif principal', goalLabel)}
            ${briefSummary ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr><td style="background:rgba(255,255,255,0.05);border:1px solid rgba(147,197,253,0.2);border-left:3px solid #93c5fd;border-radius:0 10px 10px 0;padding:14px 18px;">
                <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Ce que le prospect a dit</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);line-height:1.75;">${briefSummary.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </td></tr>
            </table>` : ''}
            <p style="margin:16px 0 20px;font-size:12px;color:rgba(255,255,255,0.45);">Ce prospect a partagé son email via Amara (chat IA) sur audreyrh.com.</p>
            ${ctaButton(`mailto:${data.email}`, `Répondre à ${data.email} →`)}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  const r = await sendEmail(client, {
    from: FROM,
    to: NOTIFY_TO,
    replyTo: data.email,
    subject: `💬 Nouveau lead — ${segmentLabel} · ${data.email}`,
    html,
  });
  if (r.error) console.error('[Resend] Lead notification error:', JSON.stringify(r.error));
  else console.log('[Resend] Lead notification sent, id:', r.data?.id);
}

// ─── Contact / grant questionnaire ──────────────────────────────────────────

export type ContactEmailData = {
  name: string;
  email: string;
  companyName: string;
  registrationInfo: string;
  cities: string;
  activities: string;
  fundingNeeds: string;
  dreams: string;
  pastGrants: string;
  employees: string;
  planToHire: string;
  openToInterns: string;
  desjardins: string;
};

const yesNo = (val: string) => val === 'oui' ? 'Oui ✓' : val === 'non' ? 'Non' : val;

const longFieldBox = (label: string, value: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
    <tr><td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:10px;padding:14px 18px;">
      <p style="margin:0 0 5px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">${label}</p>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);line-height:1.7;">${value.replace(/\n/g, '<br/>')}</p>
    </td></tr>
  </table>`;

export async function sendContactEmails(data: ContactEmailData) {
  const client = getClient();

  // 1 — Internal lead notification to Audrey (full questionnaire)
  const notifyHtml = `${emailWrapperOpen(620)}
${compactHeader('AudreyRH · Questionnaire subventions', 'Nouvelle demande de recherche de subventions')}
        <tr>
          <td style="padding:20px 36px 0;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr><td style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:8px;padding:9px 16px;">
                <p style="margin:0;font-size:11px;font-weight:600;color:#93c5fd;">
                  ${data.name} &nbsp;·&nbsp;
                  <a href="mailto:${data.email}" style="color:#93c5fd;text-decoration:none;">${data.email}</a> &nbsp;·&nbsp;
                  ${data.companyName}
                </p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 36px 32px;">

            <p style="margin:0 0 12px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">Organisation</p>
            ${longFieldBox('Nom de l\'entreprise ou organisme', data.companyName)}
            ${longFieldBox('Enregistrement (année & forme)', data.registrationInfo)}
            ${longFieldBox('Ville(s)', data.cities)}

            <p style="margin:16px 0 12px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">Activités & Besoins</p>
            ${longFieldBox('Activités de l\'entreprise', data.activities)}
            ${longFieldBox('Besoins de financement', data.fundingNeeds)}
            ${longFieldBox('Projets / Rêves non réalisés', data.dreams)}

            <p style="margin:16px 0 12px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">Historique & Ressources humaines</p>
            ${longFieldBox('Demandes de subventions passées', data.pastGrants)}
            ${fieldBox('Employés', data.employees)}
            ${fieldBox('Planifie embaucher d\'ici 1 an', yesNo(data.planToHire))}
            ${fieldBox('Ouvert aux stagiaires', yesNo(data.openToInterns))}

            <p style="margin:16px 0 12px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">Finances</p>
            ${fieldBox('Compte bancaire Desjardins', yesNo(data.desjardins))}

            <div style="margin-top:24px;">
              ${ctaButton(`mailto:${data.email}`, `Répondre à ${data.name} →`)}
            </div>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  // 2 — Bilingual auto-reply to client
  const replyHtml = `${emailWrapperOpen(600)}
${logoHeader('Questionnaire reçu · Questionnaire received')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:23px;font-weight:700;color:#ffffff;">Bonjour ${data.name},</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.8;">
              Merci d'avoir rempli le questionnaire de recherche de subventions pour <strong style="color:#ffffff;">${data.companyName}</strong>.
              Vos réponses ont bien été reçues — Audrey vous contactera dans les <strong style="color:#ffffff;">24 à 48 heures ouvrables</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow('Organisation', data.companyName)}
                  ${fieldRow('Courriel', data.email)}
                  ${fieldRow('Statut', 'Questionnaire reçu — En cours d\'analyse', true)}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:18px 22px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);">Note de confidentialité</p>
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.75;">
                  Soyez assuré(e) de la confidentialité des données que vous nous avez partagées.<br/>
                  <em style="color:rgba(255,255,255,0.35);">Rest assured of the confidentiality of all information you have shared with us.</em>
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.75;">
              En attendant, vous pouvez aussi réserver une consultation directement en ligne :
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${ctaButton('https://audreyrh.com/book', 'Réserver une consultation →')}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr><td style="border-top:1px solid rgba(255,255,255,0.07);font-size:0;">&nbsp;</td></tr>
            </table>

            <p style="margin:0 0 6px;font-size:19px;font-weight:700;color:#ffffff;">Hello ${data.name},</p>
            <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;">
              Thank you for completing the grant research questionnaire for <strong style="color:#ffffff;">${data.companyName}</strong>.
              Your answers have been received — Audrey will reach out within <strong style="color:#ffffff;">24 to 48 business hours</strong>.
            </p>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.75;">
              In the meantime, feel free to book a consultation at
              <a href="https://audreyrh.com/book" style="color:#93c5fd;font-weight:600;text-decoration:none;">audreyrh.com/book</a>.
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log('[Resend] Sending grant questionnaire emails — notify + reply to:', data.email);
  const [r1, r2] = await Promise.all([
    sendEmail(client, { from: FROM, to: NOTIFY_TO, replyTo: data.email, subject: `Questionnaire subventions : ${data.name} — ${data.companyName}`, html: notifyHtml }),
    sendEmail(client, { from: FROM, to: data.email, subject: `Questionnaire reçu / Questionnaire received — AudreyRH`, html: replyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Contact notify email error:', JSON.stringify(r1.error));
  else console.log('[Resend] Contact notify email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Contact auto-reply email error:', JSON.stringify(r2.error));
  else console.log('[Resend] Contact auto-reply email sent, id:', r2.data?.id);
  if (r1.error && r2.error) throw new Error(`Both contact emails failed: ${r1.error.message}`);
}

export type SimpleContactData = {
  name: string;
  email: string;
  type: string;
  message: string;
};

export async function sendSimpleContactEmail(data: SimpleContactData) {
  const client = getClient();
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#239b56;padding:24px 32px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">AudreyRH · Message reçu</p>
            <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">Nouveau message depuis la page Contact</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">

            <!-- De -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#f8faf8;border:1px solid #e2e8e2;border-radius:8px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">De</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${data.name} &lt;<a href="mailto:${data.email}" style="color:#239b56;text-decoration:none;">${data.email}</a>&gt;</p>
                </td>
              </tr>
            </table>

            <!-- Sujet -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#f8faf8;border:1px solid #e2e8e2;border-radius:8px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Sujet</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${data.type}</p>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#f8faf8;border:1px solid #e2e8e2;border-left:4px solid #239b56;border-radius:8px;padding:16px 18px;">
                  <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Message</p>
                  <p style="margin:0;font-size:15px;color:#1f2937;line-height:1.65;white-space:pre-wrap;">${data.message}</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#239b56;border-radius:8px;">
                  <a href="mailto:${data.email}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">Répondre à ${data.name}</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8faf8;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#374151;">AudreyRH</p>
            <p style="margin:0;font-size:11px;color:#9ca3af;">
              Montréal, Québec &nbsp;·&nbsp;
              <a href="mailto:info@audreyrh.com" style="color:#9ca3af;text-decoration:none;">info@audreyrh.com</a> &nbsp;·&nbsp;
              <a href="https://audreyrh.com" style="color:#239b56;text-decoration:none;">audreyrh.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  console.log('[Resend] Sending simple contact email to Audrey from:', data.email);
  const r = await sendEmail(client, {
    from: FROM,
    to: NOTIFY_TO,
    replyTo: data.email,
    subject: `Message de ${data.name} — AudreyRH`,
    html,
  });
  if (r.error) throw new Error(`Simple contact email failed: ${r.error.message}`);
  else console.log('[Resend] Simple contact email sent, id:', r.data?.id);
}

// ─── Admin: Appointment Approved ─────────────────────────────────────────────

export type AppointmentActionData = {
  clientName: string;
  clientEmail: string;
  date?: string;
  startTime?: string | null;
  endTime?: string | null;
  platform?: string;
  reason?: string;
};

export async function sendAppointmentApproved(data: AppointmentActionData) {
  const client = getClient();
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange = data.startTime && data.endTime ? `${data.startTime} – ${data.endTime} (HE)` : '';

  const html = `${emailWrapperOpen(600)}
${logoHeader('✓&nbsp;&nbsp;Consultation confirmée')}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 6px;font-size:23px;font-weight:700;color:#ffffff;">Bonjour ${data.clientName},</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.8;">
              Votre demande de consultation a été <strong style="color:#4ade80;">confirmée</strong> par Audrey Mondesir, CRIA.<br/>
              <em style="color:rgba(255,255,255,0.35);">Your consultation request has been confirmed by Audrey Mondesir, CRIA.</em>
            </p>
            ${data.date ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow('Date', data.date)}
                  ${timeRange ? fieldRow('Heure / Time', timeRange) : ''}
                  ${data.platform ? fieldRow('Plateforme', platformLabel) : ''}
                  ${data.reason ? fieldRow('Sujet / Subject', data.reason, true) : ''}
                </table>
              </td></tr>
            </table>` : ''}
            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.75;">
              Le lien ${platformLabel} vous sera envoyé <strong style="color:#ffffff;">24 à 48 heures avant</strong> votre rendez-vous.
              <br/><em style="color:rgba(255,255,255,0.35);">The ${platformLabel} link will be sent to you 24–48 hours before your appointment.</em>
            </p>
            <p style="margin:0 0 32px;font-size:13px;color:rgba(255,255,255,0.55);">
              Questions ? <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  const r = await sendEmail(client, {
    from: FROM, to: data.clientEmail,
    subject: 'Consultation confirmée — AudreyRH',
    html,
  });
  if (r.error) console.error('[Resend] Approve email error:', r.error.message);
  else console.log('[Resend] Approve email sent, id:', r.data?.id);
}

// ─── Admin: Appointment Rejected ─────────────────────────────────────────────

export async function sendAppointmentRejected(data: {
  clientName: string;
  clientEmail: string;
  language?: "fr" | "en";
}) {
  const client = getClient();
  const isFr = (data.language ?? "fr") === "fr";

  const T = {
    subject: isFr
      ? 'Votre demande de consultation — AudreyRH'
      : 'Your Consultation Request — AudreyRH',
    header: isFr ? 'Demande non retenue' : 'Request Not Retained',
    greeting: isFr ? `Bonjour ${data.clientName},` : `Hello ${data.clientName},`,
    body: isFr
      ? `Malheureusement, nous ne sommes pas en mesure de confirmer votre demande de consultation pour le moment.`
      : `Unfortunately, we are unable to confirm your consultation request at this time.`,
    note: isFr
      ? `Vous pouvez soumettre une nouvelle demande ou nous contacter directement pour trouver un créneau qui vous convient.`
      : `You may submit a new request or contact us directly to find a time that works for you.`,
    questions: isFr ? 'Questions ?' : 'Questions?',
    cta: isFr ? 'Nouvelle demande →' : 'Submit a new request →',
  };

  const html = `${emailWrapperOpen(600)}
${logoHeader(T.header)}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">${T.greeting}</p>
            <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">${T.body}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:18px 22px;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.75;">${T.note}</p>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.55);">
              ${T.questions} <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-top:20px;">
              ${ctaButton('https://audreyrh.com/book', T.cta)}
            </table>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  const r = await sendEmail(client, { from: FROM, to: data.clientEmail, subject: T.subject, html });
  if (r.error) console.error('[Resend] Reject email error:', r.error.message);
  else console.log('[Resend] Reject email sent, id:', r.data?.id);
}

// ─── Admin: Appointment Rescheduled ──────────────────────────────────────────

export async function sendAppointmentRescheduled(data: {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  language?: "fr" | "en";
}) {
  const client = getClient();
  const isFr = (data.language ?? "fr") === "fr";
  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange = `${data.startTime} – ${data.endTime} (HE)`;

  const T = {
    subject: isFr
      ? 'Consultation reprogrammée — AudreyRH'
      : 'Your Consultation Has Been Rescheduled — AudreyRH',
    header: isFr ? 'Consultation reprogrammée' : 'Consultation Rescheduled',
    greeting: isFr ? `Bonjour ${data.clientName},` : `Hello ${data.clientName},`,
    body: isFr
      ? `Votre consultation a été <strong style="color:#93c5fd;">reprogrammée</strong> à la date suivante.`
      : `Your consultation has been <strong style="color:#93c5fd;">rescheduled</strong> to the following date.`,
    dateLabel: isFr ? 'Nouvelle date' : 'New Date',
    timeLabel: isFr ? 'Heure (HE)' : 'Time (ET)',
    platformLabel2: isFr ? 'Plateforme' : 'Platform',
    linkNote: isFr
      ? `Le lien ${platformLabel} vous sera envoyé <strong style="color:#ffffff;">24 à 48 heures avant</strong> votre rendez-vous.`
      : `Your ${platformLabel} link will be sent to you <strong style="color:#ffffff;">24 to 48 hours before</strong> your appointment.`,
    questions: isFr ? 'Questions ?' : 'Questions?',
  };

  const html = `${emailWrapperOpen(600)}
${logoHeader(T.header)}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">${T.greeting}</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">${T.body}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:12px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow(T.dateLabel, data.date)}
                  ${fieldRow(T.timeLabel, timeRange)}
                  ${fieldRow(T.platformLabel2, platformLabel, true)}
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.75;">${T.linkNote}</p>
            <p style="margin:28px 0 0;font-size:13px;color:rgba(255,255,255,0.55);">
              ${T.questions} <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;font-weight:600;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  const r = await sendEmail(client, { from: FROM, to: data.clientEmail, subject: T.subject, html });
  if (r.error) console.error('[Resend] Reschedule email error:', r.error.message);
  else console.log('[Resend] Reschedule email sent, id:', r.data?.id);
}

// ─── Booking Confirmation with Google Meet Link ───────────────────────────────

export type MeetConfirmationData = {
  clientName: string;
  clientEmail: string;
  meetLink: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  platform: string;
  reason: string;
  amount?: string;
  stripeId?: string;
  language?: "fr" | "en";
};

function formatLocalDate(dateStr: string, lang: "fr" | "en"): string {
  if (!dateStr) return dateStr;
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (lang === 'en') {
      return date.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function buildIcsAttachment(
  dateStr: string,
  startTime: string,
  endTime: string,
  meetLink: string,
  lang: "fr" | "en"
): string | null {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const description = lang === 'fr'
      ? `Consultation stratégique de carrière avec Audrey Mondesir\\, CRIA.\\nLien de réunion : ${meetLink}`
      : `Career strategy consultation with Audrey Mondesir\\, CRIA.\\nMeeting link: ${meetLink}`;

    const { error, value } = ics.createEvent({
      title: 'Consultation AudreyRH',
      start: [y, m, d, startH, startM],
      end: [y, m, d, endH, endM],
      location: meetLink,
      description,
      url: meetLink,
      status: 'CONFIRMED',
      organizer: { name: 'AudreyRH', email: 'info@audreyrh.com' },
      productId: 'audreyrh/ics',
    });

    if (error || !value) {
      console.error('[ICS] Failed to generate .ics:', error);
      return null;
    }
    return value;
  } catch (err: any) {
    console.error('[ICS] Exception building .ics:', err.message);
    return null;
  }
}

export async function sendMeetConfirmation(data: MeetConfirmationData) {
  const client = getClient();
  const lang = data.language ?? "fr";
  const isFr = lang === "fr";

  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange = data.startTime && data.endTime ? `${data.startTime} – ${data.endTime} (HE)` : '';
  const hasMeetLink = data.meetLink && data.meetLink.startsWith('http');
  const amountDisplay = data.amount ?? null;
  const formattedDate = data.date ? formatLocalDate(data.date, lang) : '';

  const dateDisplay = [formattedDate, timeRange].filter(Boolean).join(' · ');

  const T = {
    subject: isFr
      ? `Votre consultation avec AudreyRH est confirmée`
      : `Your Consultation with AudreyRH is Confirmed`,
    headerTitle: isFr ? '✓ Consultation confirmée' : '✓ Consultation Confirmed',
    greeting: isFr ? `Bonjour ${data.clientName},` : `Hello ${data.clientName},`,
    intro: isFr
      ? `Merci d'avoir contacté AudreyRH. Votre rendez-vous est fixé au <strong style="color:#ffffff;">${dateDisplay || 'une date à confirmer'}</strong>.`
      : `Thank you for reaching out to AudreyRH. Your appointment is set for <strong style="color:#ffffff;">${dateDisplay || 'a date to be confirmed'}</strong>.`,
    meetIntro: isFr
      ? 'Voici le lien pour rejoindre la réunion :'
      : 'Here is your meeting link:',
    joinBtn: isFr ? 'Rejoindre la réunion →' : 'Join the Meeting →',
    linkSoon: isFr
      ? `Le lien ${platformLabel} vous sera envoyé par email avant votre rendez-vous.`
      : `Your ${platformLabel} link will be sent to you before your appointment.`,
    closing: isFr
      ? `Veuillez préparer vos questions avant la session. Pour annuler ou déplacer, répondez simplement à cet e-mail.`
      : `Please gather any questions or info needed for the session. To cancel or reschedule, simply reply to this email.`,
  };

  const meetSection = hasMeetLink ? `
            <p style="margin:0 0 16px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.7;">${T.meetIntro}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:24px;text-align:center;">
                  <a href="${data.meetLink}"
                     style="display:inline-block;padding:14px 36px;background:#4ade80;color:#0a1628;font-weight:800;font-size:16px;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                    ${T.joinBtn}
                  </a>
                  <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.3);word-break:break-all;">${data.meetLink}</p>
                </td>
              </tr>
            </table>` : `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:18px 22px;">
                  <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.75;">${T.linkSoon}</p>
                </td>
              </tr>
            </table>`;

  const clientHtml = `${emailWrapperOpen(600)}
${logoHeader(T.headerTitle)}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">${T.greeting}</p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">${T.intro}</p>

            ${meetSection}

            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;">${T.closing}</p>

            <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;"/>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.7;">
              AudreyRH · Audrey Mondesir, CRIA · Montréal<br/>
              <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;">info@audreyrh.com</a>
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  const notifyHtml = `${emailWrapperOpen(500)}
${compactHeader('AudreyRH · Consultation confirmée', 'Meet link envoyé au client')}
        <tr>
          <td style="padding:28px 32px 32px;">
            <div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Client</p>
              <p style="margin:0;font-size:15px;color:#ffffff;">
                ${data.clientName}
                <a href="mailto:${data.clientEmail}" style="font-size:13px;color:#93c5fd;text-decoration:none;margin-left:6px;">${data.clientEmail}</a>
              </p>
            </div>
            <div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Langue / Language</p>
              <p style="margin:0;font-size:14px;color:#ffffff;">${isFr ? '🇫🇷 Français' : '🇬🇧 English'}</p>
            </div>
            ${amountDisplay ? `<div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Montant</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#4ade80;">$${amountDisplay} CAD</p>
            </div>` : ''}
            ${formattedDate ? `<div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Date${timeRange ? ' & Heure' : ''}</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${formattedDate}${timeRange ? ' · ' + timeRange : ''}</p>
            </div>` : ''}
            ${hasMeetLink ? `<div style="margin-bottom:14px;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.2px;">Meet Link (envoyé au client)</p>
              <a href="${data.meetLink}" style="font-size:13px;color:#4ade80;text-decoration:none;">${data.meetLink}</a>
            </div>` : ''}
            <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 22px;"/>
            ${ctaButton('https://audreyrh.com/admin', 'Voir dans le tableau de bord →')}
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  // Build .ics calendar invite if we have enough date/time data
  let icsAttachment: { filename: string; content: string; content_type: string } | undefined;
  if (data.date && data.startTime && data.endTime && hasMeetLink) {
    const icsContent = buildIcsAttachment(data.date, data.startTime, data.endTime, data.meetLink, lang);
    if (icsContent) {
      icsAttachment = {
        filename: 'invite.ics',
        content: Buffer.from(icsContent).toString('base64'),
        content_type: 'text/calendar; charset=utf-8; method=REQUEST',
      };
      console.log('[ICS] Calendar invite generated, attaching to confirmation email');
    }
  }

  console.log(`[Resend] Sending meet confirmation emails (${lang}) to:`, data.clientEmail);
  const [r1, r2] = await Promise.all([
    sendEmail(client, {
      from: FROM,
      to: data.clientEmail,
      subject: T.subject,
      html: clientHtml,
      ...(icsAttachment ? { attachments: [icsAttachment] } : {}),
    }),
    sendEmail(client, { from: FROM, to: NOTIFY_TO, replyTo: data.clientEmail, subject: `✓ Consultation confirmée : ${data.clientName}${amountDisplay ? ' — $' + amountDisplay + ' CAD' : ''} [${lang.toUpperCase()}]`, html: notifyHtml }),
  ]);
  if (r1.error) console.error('[Resend] Meet confirm client email error:', r1.error.message);
  else console.log('[Resend] Meet confirm client email sent, id:', r1.data?.id);
  if (r2.error) console.error('[Resend] Meet confirm notify email error:', r2.error.message);
  else console.log('[Resend] Meet confirm notify email sent, id:', r2.data?.id);
}

// ─── Manual Resend Link ───────────────────────────────────────────────────────

export type ResendLinkData = {
  clientName: string;
  clientEmail: string;
  meetLink: string;
  platform: string;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  language?: "fr" | "en";
};

export async function sendMeetLinkReminder(data: ResendLinkData) {
  const client = getClient();
  const lang = data.language ?? "fr";
  const isFr = lang === "fr";
  const isZoom = data.platform !== "google_meet";
  const platformLabel = isZoom ? "Zoom" : "Google Meet";
  const timeRange = data.startTime && data.endTime ? `${data.startTime} – ${data.endTime} (HE)` : "";
  const formattedDate = data.date ? formatLocalDate(data.date, lang) : "";
  const dateDisplay = [formattedDate, timeRange].filter(Boolean).join(" · ");

  const subject = isFr
    ? `Rappel — Votre lien de consultation AudreyRH`
    : `Reminder — Your AudreyRH Consultation Link`;

  const clientHtml = `${emailWrapperOpen(600)}
${logoHeader(isFr ? "Rappel — Votre lien de consultation" : "Reminder — Your Consultation Link")}
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#ffffff;">
              ${isFr ? `Bonjour ${data.clientName},` : `Hello ${data.clientName},`}
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.8;">
              ${isFr
                ? `Voici un rappel de votre lien ${platformLabel} pour votre consultation avec <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong>${dateDisplay ? ` prévue le <strong style="color:#ffffff;">${dateDisplay}</strong>` : ""}.`
                : `Here is a reminder of your ${platformLabel} link for your consultation with <strong style="color:#ffffff;">Audrey Mondesir, CRIA</strong>${dateDisplay ? ` scheduled for <strong style="color:#ffffff;">${dateDisplay}</strong>` : ""}.`
              }
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:28px;text-align:center;">
                  <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);">
                    ${isFr ? `Rejoindre via ${platformLabel}` : `Join via ${platformLabel}`}
                  </p>
                  <a href="${data.meetLink}"
                     style="display:inline-block;padding:14px 40px;background:#4ade80;color:#0a1628;font-weight:800;font-size:16px;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                    ${isFr ? "Rejoindre la réunion →" : "Join the Meeting →"}
                  </a>
                  <p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,0.3);word-break:break-all;">${data.meetLink}</p>
                  ${isZoom ? `<p style="margin:10px 0 0;font-size:12px;color:rgba(255,255,255,0.45);">Meeting ID: 361 751 0198 &nbsp;·&nbsp; Passcode: nTa2sG</p>` : ""}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
              ${isFr
                ? `Des questions ? Répondez simplement à cet email ou écrivez à <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;">info@audreyrh.com</a>`
                : `Questions? Simply reply to this email or write to <a href="mailto:info@audreyrh.com" style="color:#93c5fd;text-decoration:none;">info@audreyrh.com</a>`
              }
            </p>
          </td>
        </tr>
${emailFooter()}
${emailWrapperClose}`;

  console.log(`[Resend] Sending meet link reminder to:`, data.clientEmail);
  const r = await sendEmail(client, {
    from: FROM,
    to: data.clientEmail,
    subject,
    html: clientHtml,
  });
  if (r.error) {
    console.error("[Resend] Resend link email error:", r.error.message);
    throw new Error(r.error.message);
  }
  console.log("[Resend] Resend link email sent, id:", r.data?.id);
}
