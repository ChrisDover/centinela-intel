/**
 * Schedule a campaign for per-subscriber optimal send times.
 * Groups into batches of 100 for Resend batch API.
 * 500ms delay between batches for rate limit compliance.
 */

import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { calculateCohortAverage } from "./calculate-optimal";

interface ScheduleResult {
  scheduled: number;
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

const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 500;
const MAX_SCHEDULE_AHEAD_HOURS = 72;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate the next scheduledAt for a subscriber given their optimal hour.
 * Schedules for the next occurrence of that hour (today or tomorrow).
 * Must be within 72 hours (Resend limit).
 */
function getScheduledAt(optimalHour: number, baseDate: Date): Date {
  const scheduled = new Date(baseDate);
  scheduled.setUTCHours(optimalHour, 0, 0, 0);

  // If the optimal hour has already passed today, schedule for tomorrow
  if (scheduled <= baseDate) {
    scheduled.setUTCDate(scheduled.getUTCDate() + 1);
  }

  // Ensure within 72-hour window
  const maxDate = new Date(baseDate);
  maxDate.setHours(maxDate.getHours() + MAX_SCHEDULE_AHEAD_HOURS);
  if (scheduled > maxDate) {
    // Fall back to sending now + 1 minute
    return new Date(baseDate.getTime() + 60_000);
  }

  return scheduled;
}

/**
 * Send a batch of emails via Resend batch API.
 * Creates EmailSend records first, then sends, then updates with Resend IDs.
 */
export async function scheduleCampaignEmails(
  campaignId: string,
  emails: EmailToSend[]
): Promise<ScheduleResult> {
  const result: ScheduleResult = { scheduled: 0, failed: 0, errors: [] };

  // Process in batches of 100
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    try {
      const resendPayload = batch.map((email) => ({
        from: "Centinela Intel <intel@centinelaintel.com>",
        to: email.to,
        subject: email.subject,
        html: email.html,
        scheduledAt: email.scheduledAt.toISOString(),
      }));

      const response = await resend.batch.send(resendPayload);

      // Update EmailSend records with Resend IDs
      if (response.data?.data) {
        for (let j = 0; j < response.data.data.length; j++) {
          const resendResult = response.data.data[j];
          const email = batch[j];

          await prisma.emailSend.update({
            where: { id: email.emailSendId },
            data: {
              resendEmailId: resendResult.id,
              status: "scheduled",
              scheduledAt: email.scheduledAt,
            },
          });
          result.scheduled++;
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      result.errors.push(`Batch ${Math.floor(i / BATCH_SIZE)}: ${msg}`);

      // Mark batch as failed
      for (const email of batch) {
        await prisma.emailSend
          .update({
            where: { id: email.emailSendId },
            data: { status: "failed" },
          })
          .catch(() => {});
        result.failed++;
      }
    }

    // Rate limit: 500ms between batch calls
    if (i + BATCH_SIZE < emails.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return result;
}

/**
 * Prepare emails for a campaign with per-subscriber scheduling.
 * Returns EmailToSend array with scheduledAt based on optimal hours.
 */
export async function prepareScheduledEmails(
  campaignId: string,
  subscribers: { id: string; email: string; optimalSendHour: number | null; unsubscribeToken: string }[],
  renderFn: (subscriber: { id: string; email: string; unsubscribeToken: string }) => { subject: string; html: string },
): Promise<EmailToSend[]> {
  const cohortAvg = await calculateCohortAverage();
  const now = new Date();
  const emails: EmailToSend[] = [];

  for (const sub of subscribers) {
    const { subject, html } = renderFn(sub);
    const hour = sub.optimalSendHour ?? cohortAvg;
    const scheduledAt = getScheduledAt(hour, now);

    // Create EmailSend record
    const emailSend = await prisma.emailSend.create({
      data: {
        campaignId,
        subscriberId: sub.id,
        status: "pending",
        scheduledAt,
      },
    });

    emails.push({
      subscriberId: sub.id,
      to: sub.email,
      subject,
      html,
      scheduledAt,
      emailSendId: emailSend.id,
    });
  }

  return emails;
}
