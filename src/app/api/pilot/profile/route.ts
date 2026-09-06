import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser("pilot");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ pilot });
}
