import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { profileCompletionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await requireUser("pilot");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileCompletionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const pilot = await prisma.pilot.update({
    where: { userId: user.id },
    data: { ...parsed.data, profileComplete: true },
  });

  return NextResponse.json({ pilot });
}
