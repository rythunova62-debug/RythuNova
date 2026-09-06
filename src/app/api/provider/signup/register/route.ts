import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerRegisterSchema } from "@/lib/validation";
import { generateOtp, hashOtp, OTP_TTL_MS, OTP_RESEND_COOLDOWN_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = providerRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, address, pincode } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const existingRequest = await prisma.providerSignupRequest.findUnique({ where: { email } });
  if (existingRequest && Date.now() - existingRequest.otpSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return NextResponse.json(
      { error: "Please wait before requesting another OTP" },
      { status: 429 }
    );
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.providerSignupRequest.upsert({
    where: { email },
    update: { name, address, pincode, otpHash, otpExpiresAt, otpVerified: false, otpSentAt: new Date(), otpAttempts: 0 },
    create: { email, name, address, pincode, otpHash, otpExpiresAt },
  });

  await sendOtpEmail(email, otp);

  return NextResponse.json({ ok: true });
}
