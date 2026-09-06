import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpResendSchema } from "@/lib/validation";
import {
  generateVerificationToken,
  hashVerificationToken,
  VERIFICATION_TOKEN_TTL_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
} from "@/lib/verification-token";
import { sendSignupVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpResendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const existing = await prisma.adminSignupRequest.findUnique({ where: { email } });
  if (!existing) {
    return NextResponse.json({ error: "No pending signup found for this email" }, { status: 404 });
  }

  if (Date.now() - existing.verificationSentAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS) {
    return NextResponse.json(
      { error: "Please wait before requesting another verification email" },
      { status: 429 }
    );
  }

  const token = generateVerificationToken();
  const verificationTokenHash = hashVerificationToken(token);
  const verificationExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  await prisma.adminSignupRequest.update({
    where: { email },
    data: {
      verificationTokenHash,
      verificationExpiresAt,
      verificationSentAt: new Date(),
      verified: false,
    },
  });

  const origin = new URL(request.url).origin;
  const verifyUrl = `${origin}/api/auth/admin/verify-link?email=${encodeURIComponent(email)}&token=${token}`;
  await sendSignupVerificationEmail(email, verifyUrl);

  return NextResponse.json({ ok: true });
}
