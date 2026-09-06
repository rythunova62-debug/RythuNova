import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { providerPilotSchema } from "@/lib/validation";

async function getProviderId(userId: string) {
  const provider = await prisma.provider.findUnique({ where: { userId } });
  return provider?.id ?? null;
}

export async function GET() {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providerId = await getProviderId(user.id);
  if (!providerId) {
    return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
  }

  const pilots = await prisma.providerPilot.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ pilots });
}

export async function POST(request: Request) {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providerId = await getProviderId(user.id);
  if (!providerId) {
    return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = providerPilotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const pilot = await prisma.providerPilot.create({
    data: { ...parsed.data, providerId },
  });

  return NextResponse.json({ pilot });
}
