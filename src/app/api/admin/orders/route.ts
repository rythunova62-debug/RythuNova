import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createOrderSchema } from "@/lib/validation";
import { findMatchingPilots, findMatchingProviders } from "@/lib/order-matching";

export async function GET() {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      assignedPilot: { select: { id: true, name: true, phone: true } },
      assignedProvider: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const withCandidates = await Promise.all(
    orders.map(async (order) => {
      if (order.status !== "unassigned") return { ...order, candidatePilots: [], candidateProviders: [] };
      const [candidatePilots, candidateProviders] = await Promise.all([
        findMatchingPilots(order),
        findMatchingProviders(order),
      ]);
      return { ...order, candidatePilots, candidateProviders };
    })
  );

  return NextResponse.json({ orders: withCandidates });
}

export async function POST(request: Request) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: { ...parsed.data, scheduledAt: new Date(parsed.data.scheduledAt) },
  });

  return NextResponse.json({ order });
}
