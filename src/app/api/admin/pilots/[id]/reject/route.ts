import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { logAdminAction } from "@/lib/audit";
import { rejectPilotSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireUser("admin");
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = rejectPilotSchema.safeParse(body);
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
    data: { verificationStatus: "rejected", rejectionReason: parsed.data.reason },
  });

  await logAdminAction(admin.id, "pilot.reject", pilot.userId, { reason: parsed.data.reason });

  return NextResponse.json({ pilot: updated });
}
