import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { logAdminAction } from "@/lib/audit";

// Soft-remove another admin account. An admin can't remove themself here —
// that would lock them out mid-action with no confirmation UX for it.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You can't remove your own account" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "admin") {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: id } }),
  ]);

  await logAdminAction(admin.id, "admin.remove", id);

  return NextResponse.json({ ok: true });
}
