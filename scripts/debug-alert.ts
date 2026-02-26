import prisma from "../lib/prisma";
import { alertTemplate } from "../lib/emails/alert-template";
import * as fs from "fs";

async function main() {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: "cmly3uy5b0000juysogec14st" },
  });

  if (!campaign) {
    console.log("Campaign not found");
    process.exit(1);
  }

  console.log("Campaign found:", campaign.id);
  console.log("Type:", campaign.type);
  console.log("htmlContent length:", campaign.htmlContent?.length || 0);

  const data = JSON.parse(campaign.htmlContent || "{}");
  console.log("severity:", data.severity);
  console.log("body length:", data.body?.length || 0);
  console.log("body first 200 chars:", data.body?.substring(0, 200) || "EMPTY");

  // Render the full email
  const html = alertTemplate({
    subject: campaign.subject,
    severity: data.severity || "HIGH",
    body: data.body || "",
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: campaign.id,
  });

  fs.writeFileSync("/tmp/alert-preview.html", html);
  console.log("\nRendered HTML written to /tmp/alert-preview.html");
  console.log("HTML length:", html.length);

  await prisma.$disconnect();
}

main().catch(console.error);
