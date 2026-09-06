import nodemailer from "nodemailer";

const isPlaceholderSmtp = process.env.SMTP_HOST === "smtp.example.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSignupVerificationEmail(to: string, verifyUrl: string) {
  // Real SMTP creds aren't configured yet — log instead of failing the request
  // so the signup flow can still be exercised end to end in dev.
  if (isPlaceholderSmtp) {
    console.log(`[dev] Signup verification link for ${to}: ${verifyUrl}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Verify your email for RythuNova",
    text: `Click to verify your email and continue signup: ${verifyUrl}\nThis link expires in 30 minutes and can only be used once.`,
    html: `<p>Click the button below to verify your email and continue your RythuNova signup:</p><p><a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#047857;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a></p><p>Or copy this link: ${verifyUrl}</p><p>This link expires in 30 minutes and can only be used once.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (isPlaceholderSmtp) {
    console.log(`[dev] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Reset your RythuNova password",
    text: `Reset your password: ${resetUrl}\nThis link expires in 30 minutes and can only be used once.`,
    html: `<p>Click the link below to reset your RythuNova password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes and can only be used once.</p>`,
  });
}
