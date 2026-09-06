import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { createAdminSchema } from "@/lib/validation";
import { getClientIp } from "@/lib/request-ip";
import { logAdminAction } from "@/lib/audit";

const BCRYPT_ROUNDS = 12;

// Step 2: the link has been clicked, so the email is proven. Set a password
// and the admin account goes live.
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

  const signupRequest = await prisma.adminSignupRequest.findUnique({ where: { email } });
  if (!signupRequest || !signupRequest.verified) {
    return NextResponse.json(
      { error: "Email not verified. Please click the verification link sent to your email first." },
      { status: 403 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const member = await prisma.user.create({
    data: { role: "admin", email, passwordHash },
  });

  await prisma.adminSignupRequest.delete({ where: { email } });

  // The new member is their own actor here — there is no inviting admin.
  await logAdminAction(member.id, "admin.self_register", member.id, { email });

  await createSession(member.id, getClientIp(request));

  return NextResponse.json({ ok: true });
}
