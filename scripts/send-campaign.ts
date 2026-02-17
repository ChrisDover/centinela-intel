/**
 * One-off: Send a campaign by ID from the command line.
 * Usage: npx tsx scripts/send-campaign.ts <campaignId>
 */

import { sendCampaign } from "../lib/campaigns/send-brief";
import { postBriefToLinkedIn, type BriefData } from "../lib/linkedin/post-brief";
import prisma from "../lib/prisma";

async function main() {
  const campaignId = process.argv[2];
  if (!campaignId) {
    console.error("Usage: npx tsx scripts/send-campaign.ts <campaignId>");
    process.exit(1);
  }

  const campaign = await prisma.emailCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) {
    console.error(`Campaign ${campaignId} not found`);
    process.exit(1);
  }

  console.log(`Sending campaign: ${campaign.subject} (${campaign.status})`);

  const result = await sendCampaign(campaignId);
  console.log(`Sent: ${result.scheduled}, Failed: ${result.failed}`);
  if (result.errors.length > 0) {
    console.log("Errors:", result.errors);
  }

  // Post to LinkedIn
  if (campaign.htmlContent) {
    try {
      const briefData: BriefData = JSON.parse(campaign.htmlContent);
      const linkedinResult = await postBriefToLinkedIn(briefData, campaignId);
      console.log("LinkedIn:", linkedinResult.success ? `Posted (${linkedinResult.postId})` : `Failed: ${linkedinResult.error}`);
    } catch (err) {
      console.error("LinkedIn error:", err);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
