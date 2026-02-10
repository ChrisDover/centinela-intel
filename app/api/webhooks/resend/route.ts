import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const event = await request.json();

  if (!event?.type || !event?.data) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { type, data } = event;

  try {
    const toEmail = Array.isArray(data.to) ? data.to[0] : data.to;
    const subscriber = toEmail
      ? await prisma.subscriber.findUnique({ where: { email: toEmail } })
      : null;

    // Create EmailEvent record
    await prisma.emailEvent.create({
      data: {
        subscriberId: subscriber?.id || null,
        emailId: data.email_id || null,
        type,
        metadata: JSON.stringify(data),
      },
    });

    // Update subscriber engagement metrics
    if (subscriber) {
      switch (type) {
        case "email.delivered":
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { emailsSent: { increment: 1 } },
          });
          break;

        case "email.opened":
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsOpened: { increment: 1 },
              engagementScore: { increment: 1 },
            },
          });
          break;

        case "email.clicked":
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsClicked: { increment: 1 },
              engagementScore: { increment: 3 },
            },
          });
          break;

        case "email.bounced":
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { status: "bounced" },
          });
          break;

        case "email.complained":
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              status: "unsubscribed",
              unsubscribedAt: new Date(),
            },
          });
          break;
      }
    }

    // Look up EmailSend by resendEmailId for granular tracking
    if (data.email_id) {
      const emailSend = await prisma.emailSend.findFirst({
        where: { resendEmailId: data.email_id },
      });

      if (emailSend) {
        // Update EmailSend status on delivery
        if (type === "email.delivered") {
          await prisma.emailSend.update({
            where: { id: emailSend.id },
            data: { status: "sent", sentAt: new Date() },
          });
        }

        // Update ABTestAssignment on open/click
        if (
          emailSend.variantId &&
          (type === "email.opened" || type === "email.clicked")
        ) {
          const assignment = await prisma.aBTestAssignment.findFirst({
            where: {
              subscriberId: emailSend.subscriberId,
              variantId: emailSend.variantId,
            },
          });

          if (assignment) {
            const updateData: { opened?: boolean; clicked?: boolean } = {};
            if (type === "email.opened") updateData.opened = true;
            if (type === "email.clicked") updateData.clicked = true;

            await prisma.aBTestAssignment.update({
              where: { id: assignment.id },
              data: updateData,
            });
          }
        }

        // Track CTA clicks from UTM params
        if (type === "email.clicked" && data.click?.link) {
          try {
            const url = new URL(data.click.link);
            const utmContent = url.searchParams.get("utm_content");
            const utmTerm = url.searchParams.get("utm_term");

            if (utmContent) {
              await prisma.cTAClick.create({
                data: {
                  subscriberId: emailSend.subscriberId,
                  campaignId: emailSend.campaignId,
                  ctaType: utmContent,
                  ctaPosition: utmTerm || null,
                  url: data.click.link,
                },
              });
            }
          } catch {
            // URL parsing failed — skip CTA tracking
          }
        }
      }

      // Legacy campaign association via EmailEvent
      const campaignEvent = await prisma.emailEvent.findFirst({
        where: {
          emailId: data.email_id,
          type: "email.delivered",
          campaignId: { not: null },
        },
        select: { campaignId: true },
      });

      if (campaignEvent?.campaignId) {
        const updateField: Record<string, string> = {
          "email.delivered": "deliveredCount",
          "email.opened": "openedCount",
          "email.clicked": "clickedCount",
          "email.bounced": "bouncedCount",
          "email.complained": "complainedCount",
        };

        const field = updateField[type];
        if (field) {
          await prisma.emailCampaign.update({
            where: { id: campaignEvent.campaignId },
            data: { [field]: { increment: 1 } },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
