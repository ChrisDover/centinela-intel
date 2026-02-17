/**
 * One-off: Post today's brief BLUF to LinkedIn.
 */

import { postBriefToLinkedIn, type BriefData } from "../lib/linkedin/post-brief";
import prisma from "../lib/prisma";

async function main() {
  const campaignId = process.argv[2];
  if (!campaignId) {
    console.error("Usage: npx tsx scripts/post-linkedin.ts <campaignId>");
    process.exit(1);
  }

  const campaign = await prisma.emailCampaign.findUnique({ where: { id: campaignId } });
  if (campaign == null || campaign.htmlContent == null) {
    console.error("Campaign not found or no content");
    process.exit(1);
  }

  const briefData: BriefData = JSON.parse(campaign.htmlContent);
  console.log("BLUF:", briefData.bluf);
  console.log("Threat:", briefData.threatLevel);
  console.log("Developments:", (briefData.developments as unknown[]).length);

  const result = await postBriefToLinkedIn(briefData, campaignId);
  console.log("LinkedIn result:", JSON.stringify(result, null, 2));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
