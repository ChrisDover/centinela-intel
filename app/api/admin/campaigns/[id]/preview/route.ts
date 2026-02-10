import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { renderEmailForSubscriber } from "@/lib/emails/variant-renderer";

// GET /api/admin/campaigns/[id]/preview — render HTML preview
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const variantId = request.nextUrl.searchParams.get("variantId");

  const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Load A/B test variant if specified
  let variant: { id: string; value: string } | undefined;
  let testType: string | undefined;

  if (campaign.abTestId && variantId) {
    const test = await prisma.aBTest.findUnique({
      where: { id: campaign.abTestId },
    });
    if (test) {
      const variants: { id: string; value: string }[] = JSON.parse(
        test.variants
      );
      variant = variants.find((v) => v.id === variantId);
      testType = test.type;
    }
  }

  const ctaType = (campaign.tags as "trendlock" | "thunderdome" | "premium" | "briefing" | "none") || "premium";

  const { subject, html } = renderEmailForSubscriber({
    campaignType: campaign.type,
    subject: campaign.subject,
    htmlContent: campaign.htmlContent || "",
    unsubscribeUrl: "https://centinelaintel.com/api/unsubscribe?token=preview",
    ctaType,
    campaignId: id,
    variant,
    testType,
  });

  return NextResponse.json({ subject, html });
}
