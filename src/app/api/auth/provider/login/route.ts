import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { usernameLoginSchema } from "@/lib/validation";
import { getClientIp } from "@/lib/request-ip";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = usernameLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.role !== "provider" || user.deletedAt) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  if (user.accountStatus === "blocked") {
    return NextResponse.json(
      { error: "Your account has been blocked. Contact support for details." },
      { status: 403 }
    );
  }

  await createSession(user.id, getClientIp(request));

  return NextResponse.json({ ok: true });
}
