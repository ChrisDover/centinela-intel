import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { briefTemplate } from "../lib/emails/brief-template";

async function main() {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: "cmlmdght70000l804o728hled" },
  });

  if (!campaign || !campaign.htmlContent) {
    console.error("Campaign not found or no content");
    process.exit(1);
  }

  const briefData = JSON.parse(campaign.htmlContent);
  const subject = campaign.subject;

  const previewHtml = briefTemplate({
    subject,
    brief: briefData,
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: campaign.id,
  });

  const approveUrl = "https://centinelaintel.com/admin/campaigns";

  const result = await resend.emails.send({
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[APPROVE] ${subject}`,
    html: `<div style="background:#fffbe6;border:2px solid #ffb347;border-radius:8px;padding:16px;margin-bottom:24px;font-family:sans-serif;">
      <p style="margin:0 0 8px;font-weight:bold;color:#1a1a1a;">This brief is ready for your review.</p>
      <p style="margin:0 0 12px;color:#666;">Reply "send" or approve from the admin dashboard to send to all subscribers + LinkedIn.</p>
      <p style="margin:0;"><a href="${approveUrl}" style="color:#ff6348;font-weight:bold;">Open Admin Dashboard</a> &nbsp;|&nbsp; Campaign ID: ${campaign.id}</p>
    </div>
    ${previewHtml}`,
  });

  console.log("Preview email sent:", JSON.stringify(result));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
