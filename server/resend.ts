import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }

  return {
    apiKey: connectionSettings.settings.api_key as string,
    fromEmail: (connectionSettings.settings.from_email as string) || 'AudreyRH <info@audreyRH.com>',
  };
}

// WARNING: Never cache this client. Tokens expire.
export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

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
  const { client, fromEmail } = await getUncachableResendClient();

  const platformLabel = data.platform === 'google_meet' ? 'Google Meet' : 'Zoom';
  const timeRange = data.startTime && data.endTime
    ? `${data.startTime} – ${data.endTime} (HE)`
    : '';

  const clientHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de réservation — AudreyRH</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);padding:40px 48px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AudreyRH</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-transform:uppercase;">Conseillère en ressources humaines agréée · CRIA</p>
            </td>
          </tr>
          <!-- Green success band -->
          <tr>
            <td style="background:#16a34a;padding:16px 48px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">✅ &nbsp;Paiement confirmé — Votre consultation est réservée</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1e3a5f;">Bonjour ${data.clientName},</p>
              <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
                Merci pour votre confiance ! Votre consultation avec <strong>Audrey Mondesir, CRIA</strong> est confirmée. Voici un récapitulatif de votre rendez-vous :
              </p>

              <!-- Details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:32px;">
                <tr>
                  <td style="padding:28px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${data.date ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br/>
                          <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${data.date}</span>
                        </td>
                      </tr>` : ''}
                      ${timeRange ? `
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Heure</span><br/>
                          <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${timeRange}</span>
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Plateforme</span><br/>
                          <span style="font-size:16px;font-weight:600;color:#1e3a5f;">${platformLabel}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Sujet</span><br/>
                          <span style="font-size:15px;color:#1e3a5f;">${data.reason}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.7;">
                Audrey vous enverra le lien ${platformLabel} <strong>24 à 48 heures avant</strong> votre rendez-vous.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.7;">
                Pour toute question, écrivez-nous à <a href="mailto:info@audreyRH.com" style="color:#c87941;text-decoration:none;font-weight:600;">info@audreyRH.com</a>.
              </p>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />
              <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
                AudreyRH · info@audreyRH.com<br/>
                Montréal, Québec, Canada<br/>
                <em>Tous les paiements sont finaux — aucun remboursement.</em>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const notifyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;padding:32px;">
  <div style="background:#fff;border-radius:10px;padding:32px;max-width:500px;margin:auto;border:1px solid #e2e8f0;">
    <h2 style="color:#1e3a5f;margin:0 0 20px;">🗓 Nouvelle réservation confirmée</h2>
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Client</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${data.clientName}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Courriel</td><td style="padding:8px 0;"><a href="mailto:${data.clientEmail}" style="color:#c87941;">${data.clientEmail}</a></td></tr>
      ${data.date ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Date</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${data.date}</td></tr>` : ''}
      ${timeRange ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Heure</td><td style="padding:8px 0;font-weight:600;color:#1e3a5f;">${timeRange}</td></tr>` : ''}
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Plateforme</td><td style="padding:8px 0;">${platformLabel}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top;">Sujet</td><td style="padding:8px 0;color:#1e3a5f;">${data.reason}</td></tr>
    </table>
  </div>
</body>
</html>`;

  const [clientResult, audreyResult] = await Promise.allSettled([
    client.emails.send({
      from: fromEmail,
      to: data.clientEmail,
      subject: 'Confirmation de votre consultation — AudreyRH',
      html: clientHtml,
    }),
    client.emails.send({
      from: fromEmail,
      to: 'info@audreyRH.com',
      subject: `[AudreyRH] Nouvelle réservation — ${data.clientName}`,
      html: notifyHtml,
    }),
  ]);

  if (clientResult.status === 'rejected') {
    console.error('Failed to send client confirmation email:', clientResult.reason);
  }
  if (audreyResult.status === 'rejected') {
    console.error('Failed to send Audrey notification email:', audreyResult.reason);
  }
}
