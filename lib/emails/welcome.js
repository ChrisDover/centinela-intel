export function welcomeEmail(email, unsubscribeToken) {
  const unsubscribeUrl = `https://centinelaintel.com/api/unsubscribe?token=${unsubscribeToken}`;
  const briefUrl = 'https://centinelaintel.com/briefs/001';
  const siteUrl = 'https://centinelaintel.com';

  return {
    from: 'Centinela Intel <intel@centinelaintel.com>',
    to: email,
    subject: 'Welcome to The Centinela Brief',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Centinela Brief</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e17;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px; border-bottom: 1px solid #1e2636;">
              <a href="${siteUrl}" style="text-decoration: none; color: #ffffff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">
                Centinela<span style="color: #00d4aa;">Intel</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 0;">
              <h1 style="margin: 0 0 16px; color: #ffffff; font-size: 24px; font-weight: 600; line-height: 1.3;">
                You're in.
              </h1>
              <p style="margin: 0 0 24px; color: #a0aec0; font-size: 16px; line-height: 1.7;">
                Welcome to The Centinela Brief — a weekly Latin America security intelligence report delivered every Monday at 0600.
              </p>
              <p style="margin: 0 0 24px; color: #a0aec0; font-size: 16px; line-height: 1.7;">
                AI-accelerated OSINT collection. Human-verified analysis. Signal, not noise.
              </p>

              <!-- What to expect -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #141a28; border: 1px solid #1e2636; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      What you'll receive
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #00d4aa; font-size: 14px; width: 20px; vertical-align: top;">→</td>
                        <td style="padding: 6px 0; color: #a0aec0; font-size: 14px; line-height: 1.5;">Weekly LatAm threat assessment with regional risk levels</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #00d4aa; font-size: 14px; width: 20px; vertical-align: top;">→</td>
                        <td style="padding: 6px 0; color: #a0aec0; font-size: 14px; line-height: 1.5;">Top security developments across Mexico, Central America, Colombia, Ecuador</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #00d4aa; font-size: 14px; width: 20px; vertical-align: top;">→</td>
                        <td style="padding: 6px 0; color: #a0aec0; font-size: 14px; line-height: 1.5;">Country-by-country operational guidance and travel risk updates</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #00d4aa; font-size: 14px; width: 20px; vertical-align: top;">→</td>
                        <td style="padding: 6px 0; color: #a0aec0; font-size: 14px; line-height: 1.5;">Analyst assessment with forward-looking indicators to watch</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="margin: 0 0 16px; color: #a0aec0; font-size: 16px; line-height: 1.7;">
                Your first brief arrives Monday. In the meantime, here's the latest:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #00d4aa; border-radius: 6px;">
                    <a href="${briefUrl}" style="display: inline-block; padding: 12px 28px; color: #0a0e17; font-size: 14px; font-weight: 600; text-decoration: none;">
                      Read Latest Brief
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; border-top: 1px solid #1e2636;">
              <p style="margin: 0 0 8px; color: #4a5568; font-size: 12px; line-height: 1.5;">
                Centinela Intel — A service of Enfocado Capital LLC
              </p>
              <p style="margin: 0; color: #4a5568; font-size: 12px; line-height: 1.5;">
                <a href="${unsubscribeUrl}" style="color: #4a5568; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
