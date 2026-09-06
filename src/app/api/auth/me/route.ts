import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  if (user.role === "pilot") {
    const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ user, pilot });
  }

  if (user.role === "provider") {
    const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ user, provider });
  }

  return NextResponse.json({ user });
}
