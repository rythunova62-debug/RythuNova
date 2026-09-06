import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { providerFleetSchema } from "@/lib/validation";

export async function GET() {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ provider });
}

export async function PATCH(request: Request) {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = providerFleetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const provider = await prisma.provider.update({
    where: { userId: user.id },
    data: parsed.data,
  });

  return NextResponse.json({ provider });
}
