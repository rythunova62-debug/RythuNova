import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { generateVerificationToken, hashVerificationToken, VERIFICATION_TOKEN_TTL_MS } from "@/lib/verification-token";
import { sendPasswordResetEmail } from "@/lib/mail";

const GENERIC_MESSAGE = "If that email is registered, a password reset link has been sent.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  // Always return the same response whether or not the email exists —
  // avoids account enumeration.
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.deletedAt && user.accountStatus !== "blocked") {
    const token = generateVerificationToken();
    const tokenHash = hashVerificationToken(token);
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/auth/reset-password?token=${token}`;

    // Don't let a transient SMTP failure turn into a 500 that leaks whether
    // the email existed (a slow/erroring send vs. instant response would be
    // a timing side-channel) or blocks the generic response.
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (err) {
      console.error("Failed to send password reset email", err);
    }
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
