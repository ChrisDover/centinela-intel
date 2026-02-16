/**
 * Campaign send pipeline.
 * Sends emails immediately via Resend individual sends (not batch/scheduled).
 * Resend rate limit: 2 requests/second — uses 600ms delay + retry on 429.
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

// 600ms between sends = ~1.6 req/s, safely under Resend's 2 req/s limit
const SEND_DELAY_MS = 600;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a single email with retry on rate limit (429).
 */
async function sendWithRetry(
  to: string,
  subject: string,
  html: string
): Promise<{ id: string } | { error: string }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to,
      subject,
      html,
    });

    if (response.data?.id) {
      return { id: response.data.id };
    }

    // Retry on rate limit
    if (response.error?.name === "rate_limit_exceeded" && attempt < MAX_RETRIES - 1) {
      console.log(`[Send] Rate limited on ${to}, retrying in ${RETRY_DELAY_MS}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY_MS);
      continue;
    }

    return { error: response.error?.message || "No email ID returned" };
  }

  return { error: "Max retries exceeded" };
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
      const sendResult = await sendWithRetry(email.to, email.subject, email.html);

      if ("id" in sendResult) {
        await prisma.emailSend.update({
          where: { id: email.emailSendId },
          data: {
            resendEmailId: sendResult.id,
            status: "sent",
            sentAt: new Date(),
          },
        });
        result.scheduled++;
      } else {
        throw new Error(sendResult.error);
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
