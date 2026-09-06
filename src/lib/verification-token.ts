import { randomBytes, createHash } from "crypto";

// Shared by password reset links and signup email-verification links —
// both are "random token, hashed at rest, single-use, time-limited" the
// same way.
export const VERIFICATION_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
