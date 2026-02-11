import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      plan: true,
      planTier: true,
      planStatus: true,
      countries: true,
      focusAreas: true,
      createdAt: true,
      onboardedAt: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Fetch recent briefs for the client's countries
  let briefs: Array<{
    id: string;
    country: string;
    countryName: string;
    date: string;
    threatLevel: string;
    createdAt: Date;
  }> = [];

  if (client.countries) {
    try {
      const countriesArr = JSON.parse(client.countries) as Array<{
        code: string;
        name: string;
      }>;
      const countryCodes = countriesArr.map((c) => c.code);

      if (countryCodes.length > 0) {
        briefs = await prisma.clientBrief.findMany({
          where: { country: { in: countryCodes } },
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            country: true,
            countryName: true,
            date: true,
            threatLevel: true,
            createdAt: true,
          },
        });
      }
    } catch {
      // Invalid JSON in countries field — skip
    }
  }

  return NextResponse.json({ client, briefs });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const allowedFields = [
    "name",
    "company",
    "planTier",
    "planStatus",
    "countries",
    "focusAreas",
  ];
  const data: Record<string, string> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.client.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
