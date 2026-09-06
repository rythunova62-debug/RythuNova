import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpVerifySchema } from "@/lib/validation";
import { hashOtp, OTP_MAX_ATTEMPTS } from "@/lib/otp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, otp } = parsed.data;
  const request_ = await prisma.providerSignupRequest.findUnique({ where: { email } });
  if (!request_) {
    return NextResponse.json({ error: "No pending signup found for this email" }, { status: 404 });
  }

  if (request_.otpExpiresAt < new Date()) {
    return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
  }

  if (request_.otpAttempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many incorrect attempts. Please request a new OTP." },
      { status: 429 }
    );
  }

  if (hashOtp(otp) !== request_.otpHash) {
    await prisma.providerSignupRequest.update({
      where: { email },
      data: { otpAttempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
  }

  await prisma.providerSignupRequest.update({
    where: { email },
    data: { otpVerified: true },
  });

  return NextResponse.json({ ok: true });
}
