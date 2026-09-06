import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { createAdminSchema } from "@/lib/validation";
import { getClientIp } from "@/lib/request-ip";
import { logAdminAction } from "@/lib/audit";

const BCRYPT_ROUNDS = 12;

// Team-member sign-up with no verification step: the account is live as soon
// as the form is submitted, so anyone who reaches this URL gets full admin
// access. That is deliberate while the outbound mailbox is a temporary Resend
// sandbox that can only deliver to one address — a verification link would
// simply never arrive. The email-link version is in git history (5d4895c) and
// should be restored once the real mailbox is configured.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

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
