import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.auditLog.findMany({
    include: { admin: { select: { email: true } } },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return NextResponse.json({ logs });
}
