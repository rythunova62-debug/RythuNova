import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { providerPilotSchema } from "@/lib/validation";

async function getOwnedPilot(userId: string, pilotId: string) {
  const provider = await prisma.provider.findUnique({ where: { userId } });
  if (!provider) return null;
  const pilot = await prisma.providerPilot.findUnique({ where: { id: pilotId } });
  if (!pilot || pilot.providerId !== provider.id) return null;
  return pilot;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedPilot(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = providerPilotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const pilot = await prisma.providerPilot.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ pilot });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedPilot(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
  }

  await prisma.providerPilot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
