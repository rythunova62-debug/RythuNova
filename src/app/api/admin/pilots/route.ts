import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pilots = await prisma.pilot.findMany({
    include: { user: { select: { email: true, accountStatus: true, deletedAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ pilots });
}
