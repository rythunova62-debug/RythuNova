import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { logAdminAction } from "@/lib/audit";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pilot = await prisma.pilot.findUnique({ where: { id } });
  if (!pilot) {
    return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
  }

  const updated = await prisma.pilot.update({
    where: { id },
    data: { verificationStatus: "verified" },
  });

  await logAdminAction(admin.id, "pilot.verify", pilot.userId);

  return NextResponse.json({ pilot: updated });
}
