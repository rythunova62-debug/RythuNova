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

  await prisma.$transaction([
    prisma.user.update({ where: { id: pilot.userId }, data: { accountStatus: "blocked" } }),
    prisma.session.deleteMany({ where: { userId: pilot.userId } }),
  ]);

  await logAdminAction(admin.id, "pilot.block", pilot.userId);

  return NextResponse.json({ ok: true });
}
