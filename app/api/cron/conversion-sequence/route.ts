import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import {
  getSequenceEmail,
  type SequenceDay,
} from "@/lib/emails/conversion-sequence";

export const maxDuration = 60;

// Sequence days and the hour windows they target
const SEQUENCE_DAYS: SequenceDay[] = [3, 7, 14];

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// POST /api/cron/conversion-sequence — runs daily, sends drip emails
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: { day: number; sent: number; errors: string[] }[] = [];

  for (const day of SEQUENCE_DAYS) {
    // Find subscribers who signed up exactly `day` days ago (within a 24h window)
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - day);
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const subscribers = await prisma.subscriber.findMany({
      where: {
        status: "active",
        subscribedAt: { gte: dayStart, lte: dayEnd },
      },
      select: { id: true, email: true, unsubscribeToken: true },
    });

    // Filter out anyone who already received this sequence email
    // (Check by looking for a campaign with matching subject sent to them)
    const sequenceTag = `sequence-day-${day}`;
    const alreadySent = new Set<string>();

    if (subscribers.length > 0) {
      const existingSends = await prisma.emailSend.findMany({
        where: {
          subscriberId: { in: subscribers.map((s) => s.id) },
          campaign: { tags: sequenceTag },
        },
        select: { subscriberId: true },
      });
      for (const s of existingSends) {
        alreadySent.add(s.subscriberId);
      }
    }

    const toSend = subscribers.filter((s) => !alreadySent.has(s.id));

    if (toSend.length === 0) {
      results.push({ day, sent: 0, errors: [] });
      continue;
    }

    // Create a campaign record for tracking
    const sampleEmail = getSequenceEmail(day, { unsubscribeUrl: "#" });
    const campaign = await prisma.emailCampaign.create({
      data: {
        type: "broadcast",
        subject: sampleEmail.subject,
        tags: sequenceTag,
        status: "sending",
        recipientCount: toSend.length,
      },
    });

    let sent = 0;
    const errors: string[] = [];

    for (const sub of toSend) {
      const unsubscribeUrl = `https://centinelaintel.com/api/unsubscribe?token=${sub.unsubscribeToken}`;
      const email = getSequenceEmail(day, { unsubscribeUrl });

      try {
        const response = await resend.emails.send({
          from: "Centinela Intel <intel@centinelaintel.com>",
          to: sub.email,
          subject: email.subject,
          html: email.html,
        });

        if (response.data?.id) {
          await prisma.emailSend.create({
            data: {
              campaignId: campaign.id,
              subscriberId: sub.id,
              resendEmailId: response.data.id,
              status: "sent",
              sentAt: new Date(),
            },
          });
          sent++;
        } else {
          errors.push(`${sub.email}: ${response.error?.message || "No ID"}`);
        }
      } catch (err) {
        errors.push(
          `${sub.email}: ${err instanceof Error ? err.message : "Unknown"}`
        );
      }

      // Rate limit: 600ms between sends
      if (toSend.indexOf(sub) < toSend.length - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { status: "sent", sentAt: new Date() },
    });

    results.push({ day, sent, errors });
  }

  const totalSent = results.reduce((acc, r) => acc + r.sent, 0);
  console.log(
    `[ConversionSequence] Sent ${totalSent} emails:`,
    results.map((r) => `Day ${r.day}: ${r.sent}`).join(", ")
  );

  return NextResponse.json({ results, totalSent });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
