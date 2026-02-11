import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendMagicLink } from "@/lib/client-auth";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, country, countryName } = await request.json();

    if (!sessionId || !country || !countryName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session to get the customer email
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const email = session.customer_details?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Could not determine email from checkout session" },
        { status: 400 }
      );
    }

    // Update the client record with country selection
    const client = await prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found. Please complete checkout first." },
        { status: 404 }
      );
    }

    await prisma.client.update({
      where: { id: client.id },
      data: {
        country,
        countryName,
        onboardedAt: new Date(),
      },
    });

    // Send the first magic link so they can access the dashboard
    await sendMagicLink(email.toLowerCase());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Onboarding] Error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
