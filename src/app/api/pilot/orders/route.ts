import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser("pilot");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    return NextResponse.json({ error: "Pilot profile not found" }, { status: 404 });
  }

  const orders = await prisma.order.findMany({
    where: { assignedPilotId: pilot.id },
    orderBy: { scheduledAt: "asc" },
  });

  const counters = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "assigned").length,
    completed: orders.filter((o) => o.status === "completed").length,
    totalAcres: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.acres, 0),
  };

  return NextResponse.json({ orders, counters });
}
