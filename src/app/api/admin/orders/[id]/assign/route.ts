import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { assignOrderSchema } from "@/lib/validation";
import { logAdminAction } from "@/lib/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "completed") {
    return NextResponse.json({ error: "This order is already completed" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assignOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { type, id: assigneeId } = parsed.data;

  if (type === "pilot") {
    const pilot = await prisma.pilot.findUnique({ where: { id: assigneeId } });
    if (!pilot || pilot.verificationStatus !== "verified") {
      return NextResponse.json({ error: "Pilot not found or not verified" }, { status: 400 });
    }
  } else {
    const provider = await prisma.provider.findUnique({ where: { id: assigneeId } });
    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 400 });
    }
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "assigned",
      assignedPilotId: type === "pilot" ? assigneeId : null,
      assignedProviderId: type === "provider" ? assigneeId : null,
    },
  });

  await logAdminAction(admin.id, "order.assign", undefined, { orderId: id, type, assigneeId });

  return NextResponse.json({ order: updated });
}
