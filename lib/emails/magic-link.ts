/**
 * Magic link email template — simple branded email for client login.
 */

export function magicLinkEmail(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centinela Intel — Login</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a;">
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Access your Centinela Intel dashboard</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td>
<p style="margin: 0 0 8px; font-size: 12px; line-height: 1.6; color: #999999; font-family: monospace; letter-spacing: 0.5px;">CENTINELA INTEL — COUNTRY MONITOR</p>

<p style="margin: 24px 0 16px; font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: bold;">Access Your Dashboard</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Click the link below to access your Centinela Intel intelligence dashboard. This link is valid for 30 minutes.</p>

<p style="margin: 0 0 24px;"><a href="${verifyUrl}" style="color: #1a1a1a; font-size: 15px; font-weight: bold; text-decoration: underline;">Click here to log in &rarr;</a></p>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #999999;">If you didn't request this link, you can safely ignore this email.</p>

<p style="margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; line-height: 1.6; color: #999999;">Centinela Intel — A service of Enfocado Capital LLC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
