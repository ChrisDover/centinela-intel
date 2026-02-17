import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { welcomeEmail } from "@/lib/emails/welcome";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim()?.toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/", request.url), 303);
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === "unsubscribed") {
        await prisma.subscriber.update({
          where: { email },
          data: {
            status: "active",
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });

        const emailData = welcomeEmail(email, existing.unsubscribeToken);
        await resend.emails.send(emailData);
      }
      return NextResponse.redirect(new URL("/welcome", request.url), 303);
    }

    // Check for explicit source field first (e.g. from /linkedin landing page)
    const formSource = formData.get("source") as string | null;
    const referer = request.headers.get("referer") || "";
    let source = formSource || "direct";
    if (!formSource) {
      if (referer.includes("/linkedin")) source = "linkedin";
      else if (referer.includes("/blog")) source = "blog";
      else if (referer.includes("/subscribe")) source = "subscribe-page";
      else if (referer.includes("/briefs/")) source = "brief";
      else if (referer.includes("centinelaintel.com")) source = "homepage";
    }

    const subscriber = await prisma.subscriber.create({
      data: { email, source },
    });

    const emailData = welcomeEmail(email, subscriber.unsubscribeToken);
    await resend.emails.send(emailData);

    await prisma.emailCampaign.create({
      data: {
        type: "welcome",
        subject: emailData.subject,
        fromEmail: emailData.from,
        recipientCount: 1,
      },
    });
  } catch (error) {
    console.error("Subscribe error:", error);
  }

  return NextResponse.redirect(new URL("/welcome", request.url), 303);
}
