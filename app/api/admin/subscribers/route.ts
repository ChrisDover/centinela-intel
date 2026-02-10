import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const sort = searchParams.get("sort") || "subscribedAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 25;

  const where: Record<string, unknown> = {};

  if (search) {
    where.email = { contains: search, mode: "insensitive" };
  }
  if (status) {
    where.status = status;
  }
  if (source) {
    where.source = source;
  }

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        status: true,
        source: true,
        subscribedAt: true,
        emailsSent: true,
        emailsOpened: true,
        emailsClicked: true,
        engagementScore: true,
      },
    }),
    prisma.subscriber.count({ where }),
  ]);

  return NextResponse.json({
    subscribers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json();

  if (!id || !["active", "unsubscribed", "bounced"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated = await prisma.subscriber.update({
    where: { id },
    data: {
      status,
      ...(status === "unsubscribed" ? { unsubscribedAt: new Date() } : {}),
      ...(status === "active" ? { unsubscribedAt: null } : {}),
    },
  });

  return NextResponse.json(updated);
}
