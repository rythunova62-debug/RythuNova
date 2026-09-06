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
  const pilot = await prisma.pilot.findUnique({
    where: { id },
    include: { user: { select: { email: true, accountStatus: true, deletedAt: true } } },
  });

  if (!pilot) {
    return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
  }

  return NextResponse.json({ pilot });
}
