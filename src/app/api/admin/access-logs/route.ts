import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      email: true,
      username: true,
      accountStatus: true,
      deletedAt: true,
      lastLoginAt: true,
      lastLoginIp: true,
      lastLogoutAt: true,
      pilot: { select: { name: true } },
      provider: { select: { name: true } },
      sessions: { where: { expiresAt: { gt: new Date() } }, select: { id: true }, take: 1 },
    },
    orderBy: { lastLoginAt: "desc" },
  });

  const withComputed = users.map((u) => ({
    ...u,
    name: u.pilot?.name ?? u.provider?.name ?? null,
    isActive: u.sessions.length > 0,
  }));

  return NextResponse.json({ users: withComputed });
}
