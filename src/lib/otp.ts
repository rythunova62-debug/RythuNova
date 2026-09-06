import { randomInt, createHash } from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}

export function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}
