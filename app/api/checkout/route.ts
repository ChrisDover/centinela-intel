import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";

const TIER_PRICES: Record<string, string | undefined> = {
  "1-country": process.env.STRIPE_PRICE_1_COUNTRY,
  "2-country": process.env.STRIPE_PRICE_2_COUNTRY,
  "3-country": process.env.STRIPE_PRICE_3_COUNTRY,
  "all-countries": process.env.STRIPE_PRICE_ALL_COUNTRIES,
};

export async function POST(request: NextRequest) {
  try {
    const { tier = "1-country" } = await request.json().catch(() => ({}));

    const priceId = TIER_PRICES[tier];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan tier" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Checkout] Error creating session:", message);
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    );
  }
}
