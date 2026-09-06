import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          username: true,
          accountStatus: true,
          deletedAt: true,
          lastLoginAt: true,
          lastLoginIp: true,
          lastLogoutAt: true,
          sessions: { where: { expiresAt: { gt: new Date() } }, select: { id: true }, take: 1 },
        },
      },
      pilots: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  return NextResponse.json({
    provider: { ...provider, isActive: provider.user.sessions.length > 0 },
  });
}
