/**
 * Base email template — B&W plaintext style
 * White background, black text, 560px max-width table layout.
 * No images, no colored buttons. Color only for emergency alerts.
 */

interface BaseTemplateOptions {
  content: string;
  unsubscribeUrl: string;
  ctaBlock?: string;
  isAlert?: boolean;
  preheader?: string;
}

export function baseTemplate({
  content,
  unsubscribeUrl,
  ctaBlock,
  isAlert = false,
  preheader,
}: BaseTemplateOptions): string {
  const headerBar = isAlert
    ? `<tr><td style="background-color: #ff4757; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td></tr>`
    : "";

  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centinela Intel</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    ${headerBar}
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td>
${content}
${ctaBlock ? `\n${ctaBlock}\n` : ""}
<p style="margin: 40px 0 0; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; line-height: 1.6; color: #999999;">Centinela Intel — A service of Enfocado Capital LLC<br><a href="${unsubscribeUrl}" style="color: #999999; text-decoration: underline;">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
