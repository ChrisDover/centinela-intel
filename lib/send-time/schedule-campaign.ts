/**
 * Campaign send pipeline.
 * Sends emails immediately via Resend individual sends (not batch/scheduled).
 * Resend's scheduledAt was silently dropping ~65% of emails.
 * 500ms delay between sends for rate limit compliance.
 */

import prisma from "@/lib/prisma";
import resend from "@/lib/resend";

interface SendResult {
  scheduled: number; // keeping field name for backwards compat — means "sent"
  failed: number;
  errors: string[];
}

interface EmailToSend {
  subscriberId: string;
  to: string;
  subject: string;
  html: string;
  scheduledAt: Date;
  emailSendId: string;
  variantId?: string;
}

const SEND_DELAY_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send all campaign emails immediately via individual Resend sends.
 * Updates EmailSend records with Resend IDs and status.
 */
export async function scheduleCampaignEmails(
  campaignId: string,
  emails: EmailToSend[]
): Promise<SendResult> {
  const result: SendResult = { scheduled: 0, failed: 0, errors: [] };

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    try {
      const response = await resend.emails.send({
        from: "Centinela Intel <intel@centinelaintel.com>",
        to: email.to,
        subject: email.subject,
        html: email.html,
      });

      if (response.data?.id) {
        await prisma.emailSend.update({
          where: { id: email.emailSendId },
          data: {
            resendEmailId: response.data.id,
            status: "sent",
            sentAt: new Date(),
          },
        });
        result.scheduled++;
      } else {
        throw new Error(response.error?.message || "No email ID returned");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      result.errors.push(`${email.to}: ${msg}`);

      await prisma.emailSend
        .update({
          where: { id: email.emailSendId },
          data: { status: "failed" },
        })
        .catch(() => {});
      result.failed++;
    }

    // Rate limit between sends
    if (i < emails.length - 1) {
      await sleep(SEND_DELAY_MS);
    }
  }

  return result;
}

/**
 * Prepare emails for a campaign.
 * Returns EmailToSend array ready for immediate sending.
 */
export async function prepareScheduledEmails(
  campaignId: string,
  subscribers: { id: string; email: string; optimalSendHour: number | null; unsubscribeToken: string }[],
  renderFn: (subscriber: { id: string; email: string; unsubscribeToken: string }) => { subject: string; html: string },
): Promise<EmailToSend[]> {
  const now = new Date();
  const emails: EmailToSend[] = [];

  for (const sub of subscribers) {
    const { subject, html } = renderFn(sub);

    // Create EmailSend record
    const emailSend = await prisma.emailSend.create({
      data: {
        campaignId,
        subscriberId: sub.id,
        status: "pending",
        scheduledAt: now,
      },
    });

    emails.push({
      subscriberId: sub.id,
      to: sub.email,
      subject,
      html,
      scheduledAt: now,
      emailSendId: emailSend.id,
    });
  }

  return emails;
}
