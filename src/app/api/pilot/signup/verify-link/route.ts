import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashVerificationToken } from "@/lib/verification-token";

// Clicked from the email. On success, redirects straight into the
// create-credentials step; on failure, redirects to signup with an error
// flag rather than showing a bare JSON error for a link a human just clicked.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "";
  const token = url.searchParams.get("token") ?? "";

  const fail = () =>
    NextResponse.redirect(
      new URL(`/auth/pilot/check-email?email=${encodeURIComponent(email)}&linkError=1`, url.origin)
    );

  if (!email || !token) return fail();

  const signupRequest = await prisma.pilotSignupRequest.findUnique({ where: { email } });
  if (!signupRequest) return fail();
  if (signupRequest.verificationExpiresAt < new Date()) return fail();
  if (hashVerificationToken(token) !== signupRequest.verificationTokenHash) return fail();

  await prisma.pilotSignupRequest.update({
    where: { email },
    data: { verified: true },
  });

  return NextResponse.redirect(
    new URL(`/auth/pilot/create-credentials?email=${encodeURIComponent(email)}`, url.origin)
  );
}
