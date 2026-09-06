import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { registerAdminSchema } from "@/lib/validation";
import { getClientIp } from "@/lib/request-ip";
import { logAdminAction } from "@/lib/audit";

const BCRYPT_ROUNDS = 12;

function joinCodeMatches(supplied: string, expected: string) {
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so check that first.
  return a.length === b.length && timingSafeEqual(a, b);
}

// Team-member sign-up. There is no email verification step: the shared join
// code is what proves the person belongs, so the account is live immediately.
export async function POST(request: Request) {
  const expectedCode = process.env.ADMIN_JOIN_CODE;
  if (!expectedCode) {
    // Fail closed — without a code configured this endpoint would hand out
    // admin accounts to anyone who finds the URL.
    return NextResponse.json(
      { error: "Team registration is not enabled. Ask an existing admin to add you." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password, joinCode } = parsed.data;

  if (!joinCodeMatches(joinCode, expectedCode)) {
    return NextResponse.json({ error: "Invalid team join code" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const member = await prisma.user.create({
    data: { role: "admin", email, passwordHash },
  });

  // The new member is their own actor here — there is no inviting admin.
  await logAdminAction(member.id, "admin.self_register", member.id, { email });

  await createSession(member.id, getClientIp(request));

  return NextResponse.json({ ok: true });
}
