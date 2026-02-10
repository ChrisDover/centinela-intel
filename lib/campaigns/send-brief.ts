/**
 * Campaign send pipeline.
 * 1. Create/update EmailCampaign (status: "sending")
 * 2. Fetch active subscribers
 * 3. Assign A/B variants if test exists
 * 4. Render email per subscriber (variant + CTA + personalization)
 * 5. Calculate scheduledAt per subscriber
 * 6. Batch send via Resend (100/batch, 500ms between)
 * 7. Store EmailSend records with resendEmailId
 * 8. Update campaign status to "sent"
 */

import prisma from "@/lib/prisma";
import { renderEmailForSubscriber } from "@/lib/emails/variant-renderer";
import { assignVariant } from "@/lib/ab-testing/assign-variant";
import {
  prepareScheduledEmails,
  scheduleCampaignEmails,
} from "@/lib/send-time/schedule-campaign";
import type { CTAType } from "@/lib/emails/cta-blocks";

interface SendCampaignResult {
  campaignId: string;
  scheduled: number;
  failed: number;
  errors: string[];
}

export async function sendCampaign(
  campaignId: string
): Promise<SendCampaignResult> {
  // 1. Load campaign
  const campaign = await prisma.emailCampaign.findUniqueOrThrow({
    where: { id: campaignId },
  });

  // Update status to sending
  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: { status: "sending" },
  });

  try {
    // 2. Fetch active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { status: "active" },
      select: {
        id: true,
        email: true,
        optimalSendHour: true,
        unsubscribeToken: true,
      },
    });

    // 3. Load A/B test if exists
    let abTest: {
      id: string;
      type: string;
      variants: { id: string; value: string }[];
    } | null = null;

    if (campaign.abTestId) {
      const test = await prisma.aBTest.findUnique({
        where: { id: campaign.abTestId },
      });
      if (test && test.status === "running") {
        abTest = {
          id: test.id,
          type: test.type,
          variants: JSON.parse(test.variants),
        };
      }
    }

    // 4. Prepare emails with per-subscriber rendering
    const emails = await prepareScheduledEmails(
      campaignId,
      subscribers,
      (sub) => {
        const unsubscribeUrl = `https://centinelaintel.com/api/unsubscribe?token=${sub.unsubscribeToken}`;

        // Assign variant if A/B test exists
        let variant: { id: string; value: string } | undefined;
        if (abTest) {
          variant = assignVariant(abTest.id, sub.id, abTest.variants);

          // Create assignment record
          prisma.aBTestAssignment
            .upsert({
              where: {
                testId_subscriberId: {
                  testId: abTest.id,
                  subscriberId: sub.id,
                },
              },
              create: {
                testId: abTest.id,
                subscriberId: sub.id,
                variantId: variant.id,
              },
              update: {},
            })
            .catch(() => {});
        }

        // Parse CTA from campaign tags or default
        const ctaType = (campaign.tags as CTAType) || "premium";

        return renderEmailForSubscriber({
          campaignType: campaign.type,
          subject: campaign.subject,
          htmlContent: campaign.htmlContent || "",
          unsubscribeUrl,
          ctaType,
          campaignId,
          variant,
          testType: abTest?.type,
        });
      }
    );

    // 5-7. Batch send and store records
    const result = await scheduleCampaignEmails(campaignId, emails);

    // 8. Update campaign status
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: "sent",
        sentAt: new Date(),
        recipientCount: subscribers.length,
      },
    });

    return {
      campaignId,
      scheduled: result.scheduled,
      failed: result.failed,
      errors: result.errors,
    };
  } catch (error) {
    // Mark campaign as failed
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: "draft", notes: `Send failed: ${error instanceof Error ? error.message : "Unknown error"}` },
    });

    throw error;
  }
}
