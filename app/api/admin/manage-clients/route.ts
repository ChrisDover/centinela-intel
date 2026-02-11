import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      plan: true,
      planTier: true,
      planStatus: true,
      country: true,
      countries: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
    },
  });
  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const { action, email, id, updates } = await request.json();

  if (action === "delete" && (email || id)) {
    const where = id ? { id } : { email };
    await prisma.client.delete({ where });
    return NextResponse.json({ success: true, action: "deleted", target: email || id });
  }

  if (action === "update" && (email || id) && updates) {
    const where = id ? { id } : { email };
    const updated = await prisma.client.update({ where, data: updates });
    return NextResponse.json({ success: true, client: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
