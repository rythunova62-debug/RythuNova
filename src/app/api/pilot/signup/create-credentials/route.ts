import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { pilotCredentialsSchema } from "@/lib/validation";

const BCRYPT_ROUNDS = 12;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = pilotCredentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const signupRequest = await prisma.pilotSignupRequest.findUnique({ where: { email } });
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

  await prisma.user.create({
    data: {
      role: "pilot",
      email,
      passwordHash,
      pilot: {
        create: {
          name: signupRequest.name,
          phone: signupRequest.phone,
          village: signupRequest.village,
          mandal: signupRequest.mandal,
          district: signupRequest.district,
          licenceFileKey: signupRequest.licenceFileKey,
          photoFileKey: signupRequest.photoFileKey,
          verificationStatus: "pending",
          profileComplete: false,
        },
      },
    },
  });

  await prisma.pilotSignupRequest.delete({ where: { email } });

  return NextResponse.json({ ok: true });
}
