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
  const provider = await prisma.provider.findUnique({ where: { id } });
  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: provider.userId }, data: { accountStatus: "blocked" } }),
    prisma.session.deleteMany({ where: { userId: provider.userId } }),
  ]);

  await logAdminAction(admin.id, "provider.block", provider.userId);

  return NextResponse.json({ ok: true });
}
