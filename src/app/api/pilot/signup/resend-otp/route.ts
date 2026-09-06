import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpResendSchema } from "@/lib/validation";
import { generateOtp, hashOtp, OTP_TTL_MS, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";

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
  const existing = await prisma.pilotSignupRequest.findUnique({ where: { email } });
  if (!existing) {
    return NextResponse.json({ error: "No pending signup found for this email" }, { status: 404 });
  }

  if (Date.now() - existing.otpSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return NextResponse.json({ error: "Please wait before requesting another OTP" }, { status: 429 });
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.pilotSignupRequest.update({
    where: { email },
    data: { otpHash, otpExpiresAt, otpSentAt: new Date(), otpAttempts: 0, otpVerified: false },
  });

  await sendOtpEmail(email, otp);

  return NextResponse.json({ ok: true });
}
