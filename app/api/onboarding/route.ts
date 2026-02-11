import { NextRequest, NextResponse } from "next/server";
import getStripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendMagicLink } from "@/lib/client-auth";

// GET: Return the tier for a checkout session so the onboarding page knows the country limit
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ tier: "1-country" });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      tier: session.metadata?.tier || "1-country",
    });
  } catch {
    return NextResponse.json({ tier: "1-country" });
  }
}

// POST: Complete onboarding with country selection
export async function POST(request: NextRequest) {
  try {
    const { sessionId, countries } = await request.json();

    if (!sessionId || !countries || !Array.isArray(countries) || countries.length === 0) {
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

    // Set primary country to first selected, store all in countries JSON
    await prisma.client.update({
      where: { id: client.id },
      data: {
        country: countries.length === 22 ? "ALL" : countries[0].code,
        countryName: countries.length === 22 ? "All Countries" : countries[0].name,
        countries: JSON.stringify(countries),
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
