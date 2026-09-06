import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { providerCredentialsSchema } from "@/lib/validation";

const BCRYPT_ROUNDS = 12;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = providerCredentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, username, password } = parsed.data;

  const signupRequest = await prisma.providerSignupRequest.findUnique({ where: { email } });
  if (!signupRequest || !signupRequest.verified) {
    return NextResponse.json(
      { error: "Email not verified. Please click the verification link sent to your email first." },
      { status: 403 }
    );
  }

  const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existingUser) {
    return NextResponse.json(
      { error: existingUser.email === email ? "An account with this email already exists" : "Username is already taken" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.user.create({
    data: {
      role: "provider",
      email,
      username,
      passwordHash,
      provider: {
        create: {
          name: signupRequest.name,
          address: signupRequest.address,
          pincode: signupRequest.pincode,
        },
      },
    },
  });

  await prisma.providerSignupRequest.delete({ where: { email } });

  return NextResponse.json({ ok: true });
}
