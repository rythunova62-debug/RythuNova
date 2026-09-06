import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = await prisma.provider.findMany({
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
      pilots: { select: { id: true, active: true, acresSprayed: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const withComputed = providers.map((p) => ({
    ...p,
    isActive: p.user.sessions.length > 0,
    pilotCount: p.pilots.length,
    activePilotCount: p.pilots.filter((pilot) => pilot.active).length,
    totalAcresSprayed: p.pilots.reduce((sum, pilot) => sum + pilot.acresSprayed, 0),
  }));

  return NextResponse.json({ providers: withComputed });
}
