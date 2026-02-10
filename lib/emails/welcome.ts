export function welcomeEmail(email: string, unsubscribeToken: string) {
  const unsubscribeUrl = `https://centinelaintel.com/api/unsubscribe?token=${unsubscribeToken}`;
  const briefUrl = "https://centinelaintel.com/briefs/2026-02-10";

  return {
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: email,
    subject: "Welcome to The Centinela Brief",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Centinela Brief</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">You're in.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Welcome to The Centinela Brief — a daily Latin America security intelligence report delivered every morning at 0600.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Here's what you'll get each day:</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; Regional threat assessment with risk levels and trend analysis</p>
<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; Top security developments across Mexico, Central America, Colombia, Ecuador</p>
<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; Country-by-country operational guidance and travel risk updates</p>
<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; Analyst assessment with forward-looking indicators to watch</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">AI-accelerated OSINT collection. Human-verified analysis. Signal, not noise.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Your first brief arrives tomorrow morning. In the meantime, you can read the latest one here:<br><a href="${briefUrl}" style="color: #1a1a1a; text-decoration: underline;">${briefUrl}</a></p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">— Centinela Intel</p>

<p style="margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; line-height: 1.6; color: #999999;">Centinela Intel — A service of Enfocado Capital LLC<br><a href="${unsubscribeUrl}" style="color: #999999; text-decoration: underline;">Unsubscribe</a></p>

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
