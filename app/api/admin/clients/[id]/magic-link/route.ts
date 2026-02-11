import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMagicLink } from "@/lib/client-auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    select: { email: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  await sendMagicLink(client.email);

  return NextResponse.json({ success: true });
}
