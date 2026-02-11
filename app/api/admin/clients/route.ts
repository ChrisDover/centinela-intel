import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const tier = searchParams.get("tier") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 25;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) {
    where.planStatus = status;
  }
  if (tier) {
    where.planTier = tier;
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        planTier: true,
        planStatus: true,
        countries: true,
        createdAt: true,
      },
    }),
    prisma.client.count({ where }),
  ]);

  return NextResponse.json({
    clients,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const { id, planStatus, planTier } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Client ID required" }, { status: 400 });
  }

  const data: Record<string, string> = {};

  if (planStatus && ["active", "past_due", "cancelled"].includes(planStatus)) {
    data.planStatus = planStatus;
  }
  if (
    planTier &&
    ["1-country", "2-country", "3-country", "all-countries", "internal"].includes(planTier)
  ) {
    data.planTier = planTier;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.client.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
