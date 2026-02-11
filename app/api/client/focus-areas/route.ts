import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function getClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("client_session")?.value;
  if (!token) return null;
  return prisma.client.findFirst({
    where: { sessionToken: token, sessionExpiresAt: { gt: new Date() } },
  });
}

export async function GET() {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const areas: string[] = client.focusAreas ? JSON.parse(client.focusAreas) : [];
  return NextResponse.json({ focusAreas: areas });
}

export async function POST(request: Request) {
  const client = await getClient();
  if (!client) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { focusAreas } = await request.json();

  if (!Array.isArray(focusAreas) || focusAreas.length > 10) {
    return NextResponse.json({ error: "Invalid focus areas" }, { status: 400 });
  }

  const cleaned = focusAreas
    .map((a: unknown) => String(a).trim())
    .filter((a: string) => a.length > 0 && a.length <= 100)
    .slice(0, 10);

  await prisma.client.update({
    where: { id: client.id },
    data: { focusAreas: JSON.stringify(cleaned) },
  });

  return NextResponse.json({ focusAreas: cleaned });
}
