import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";
import prisma from "@/lib/prisma";

const TIER_PRICES: Record<string, string | undefined> = {
  "1-country": process.env.STRIPE_PRICE_1_COUNTRY,
  "2-country": process.env.STRIPE_PRICE_2_COUNTRY,
  "3-country": process.env.STRIPE_PRICE_3_COUNTRY,
  "all-countries": process.env.STRIPE_PRICE_ALL_COUNTRIES,
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  let tier = "1-country";
  try {
    const body = await request.json().catch(() => ({}));
    tier = body.tier || "1-country";
  } catch {
    // use default tier
  }

  const priceId = TIER_PRICES[tier];
  if (!priceId) {
    await prisma.checkoutAttempt.create({
      data: { tier, status: "failed", ip, userAgent, errorMessage: "Invalid plan tier" },
    });
    return NextResponse.json(
      { error: "Invalid plan tier" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      metadata: { tier },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com"}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com"}/watch`,
    });

    await prisma.checkoutAttempt.create({
      data: {
        tier,
        status: "initiated",
        stripeSessionId: session.id,
        ip,
        userAgent,
      },
    });

    console.log(`[Checkout] Session created: ${session.id} (${tier})`);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await prisma.checkoutAttempt.create({
      data: { tier, status: "failed", ip, userAgent, errorMessage: message },
    }).catch(() => {}); // don't let logging failure break the response

    console.error("[Checkout] Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
