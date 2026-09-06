import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pilotRegisterSchema } from "@/lib/validation";
import {
  generateVerificationToken,
  hashVerificationToken,
  VERIFICATION_TOKEN_TTL_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
} from "@/lib/verification-token";
import { sendSignupVerificationEmail } from "@/lib/mail";
import { saveUploadedFile, UploadValidationError } from "@/lib/storage";

export async function POST(request: Request) {
  const formData = await request.formData();

  const fields = {
    email: formData.get("email"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    village: formData.get("village"),
    mandal: formData.get("mandal"),
    district: formData.get("district"),
  };

  const parsed = pilotRegisterSchema.safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const licenceFile = formData.get("licence");
  const photoFile = formData.get("photo");
  if (!(licenceFile instanceof File) || !(photoFile instanceof File)) {
    return NextResponse.json(
      { error: "Both the licence and photo uploads are required" },
      { status: 400 }
    );
  }

  const { email, name, phone, village, mandal, district } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const existingRequest = await prisma.pilotSignupRequest.findUnique({ where: { email } });
  if (
    existingRequest &&
    Date.now() - existingRequest.verificationSentAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  ) {
    return NextResponse.json(
      { error: "Please wait before requesting another verification email" },
      { status: 429 }
    );
  }

  let licenceFileKey: string;
  let photoFileKey: string;
  try {
    licenceFileKey = await saveUploadedFile(licenceFile, "licences");
    photoFileKey = await saveUploadedFile(photoFile, "photos");
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const token = generateVerificationToken();
  const verificationTokenHash = hashVerificationToken(token);
  const verificationExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  await prisma.pilotSignupRequest.upsert({
    where: { email },
    update: {
      name,
      phone,
      village,
      mandal,
      district,
      licenceFileKey,
      photoFileKey,
      verificationTokenHash,
      verificationExpiresAt,
      verified: false,
      verificationSentAt: new Date(),
    },
    create: {
      email,
      name,
      phone,
      village,
      mandal,
      district,
      licenceFileKey,
      photoFileKey,
      verificationTokenHash,
      verificationExpiresAt,
    },
  });

  const origin = new URL(request.url).origin;
  const verifyUrl = `${origin}/api/pilot/signup/verify-link?email=${encodeURIComponent(email)}&token=${token}`;
  await sendSignupVerificationEmail(email, verifyUrl);

  return NextResponse.json({ ok: true });
}
