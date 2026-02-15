import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateDailyBrief } from "@/lib/ai/generate-brief";
import resend from "@/lib/resend";
import { briefTemplate } from "@/lib/emails/brief-template";

// Claude API + OSINT fetch can take 30-60s
export const maxDuration = 120;

function getDateString(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

// POST /api/cron/generate-brief — triggered by Vercel cron at 12:00 UTC (0700 ET / 0500 Phoenix)
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use ET date to determine which business day this brief is for.
  // This prevents a delayed cron run (e.g. yesterday's cron firing today)
  // from creating a brief dated "today" and blocking the real run.
  const now = new Date();
  const todayStr = getDateString(now);

  // Guard: if the cron is running more than 6 hours late, skip it —
  // the brief would have stale OSINT and would block today's real run.
  // The cron is scheduled for 12:00 UTC (07:00 ET). If it's past 18:00 UTC (13:00 ET),
  // it's too late — today's scheduled run will handle it.
  const utcHour = now.getUTCHours();
  const scheduledHour = 12; // 12:00 UTC
  const maxDelayHours = 6;
  if (utcHour >= scheduledHour + maxDelayHours) {
    console.log(`[GenerateBrief] Skipping — running ${utcHour - scheduledHour}h late (after ${scheduledHour + maxDelayHours}:00 UTC cutoff). Today's scheduled run will generate the brief.`);
    return NextResponse.json({
      message: "Skipped — cron ran too late, next scheduled run will handle it",
      utcHour,
      cutoff: scheduledHour + maxDelayHours,
    });
  }

  // Idempotency: check if a draft brief already exists for today (ET date)
  const existing = await prisma.emailCampaign.findFirst({
    where: {
      status: "draft",
      type: "brief",
      subject: { contains: todayStr },
    },
  });

  if (existing) {
    return NextResponse.json({
      message: `Draft brief already exists for ${todayStr}`,
      campaignId: existing.id,
    });
  }

  try {
    console.log(`[GenerateBrief] Generating brief for ${todayStr}...`);
    const briefData = await generateDailyBrief();

    const campaign = await prisma.emailCampaign.create({
      data: {
        type: "brief",
        status: "draft",
        subject: `The Centinela Brief — ${todayStr}`,
        htmlContent: JSON.stringify(briefData),
        tags: "premium",
        notes: "AI-generated via Claude + Brave Search OSINT",
      },
    });

    console.log(`[GenerateBrief] Draft campaign created: ${campaign.id}`);

    // Send preview to Chris for approval
    const subject = `The Centinela Brief — ${todayStr}`;
    const previewHtml = briefTemplate({
      subject,
      brief: briefData,
      unsubscribeUrl: "#",
      ctaType: "premium",
      campaignId: campaign.id,
    });

    const approveUrl = `${process.env.NEXT_PUBLIC_URL || "https://centinelaintel.com"}/admin/campaigns`;

    let emailStatus: "sent" | "failed" = "failed";
    let emailError: string | null = null;

    try {
      const emailResult = await resend.emails.send({
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

      console.log(`[GenerateBrief] Preview email response:`, JSON.stringify(emailResult));
      emailStatus = "sent";
    } catch (emailErr) {
      emailError = emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error(`[GenerateBrief] Preview email failed:`, emailError);
    }

    return NextResponse.json({
      message: emailStatus === "sent"
        ? "Brief generated and preview sent for approval"
        : "Brief generated but preview email failed",
      campaignId: campaign.id,
      emailStatus,
      emailError,
      briefData,
    });
  } catch (error) {
    console.error("Cron generate-brief error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel cron (Vercel crons use GET)
export async function GET(request: NextRequest) {
  return POST(request);
}
