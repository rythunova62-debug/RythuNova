import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { logAdminAction } from "@/lib/audit";
import { ratePilotSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = ratePilotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { id } = await params;
  const pilot = await prisma.pilot.findUnique({ where: { id } });
  if (!pilot) {
    return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
  }

  const updated = await prisma.pilot.update({
    where: { id },
    data: { rating: parsed.data.rating },
  });

  await logAdminAction(admin.id, "pilot.rate", pilot.userId, { rating: parsed.data.rating });

  return NextResponse.json({ pilot: updated });
}
