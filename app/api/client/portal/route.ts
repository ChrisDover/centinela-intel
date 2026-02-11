import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";
import { getClientFromRequest } from "@/lib/client-auth";

export async function POST(request: NextRequest) {
  const client = await getClientFromRequest(request);

  if (!client || !client.stripeCustomerId) {
    return NextResponse.redirect(new URL("/client/login", request.url));
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: client.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://centinelaintel.com"}/client/account`,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("[Portal] Error creating billing portal session:", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
