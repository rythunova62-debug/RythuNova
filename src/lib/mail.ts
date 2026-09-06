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

export async function sendOtpEmail(to: string, otp: string) {
  // Real SMTP creds aren't configured yet — log instead of failing the request
  // so the signup flow can still be exercised end to end in dev.
  if (isPlaceholderSmtp) {
    console.log(`[dev] OTP for ${to}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Your RythuNova verification code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your RythuNova verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
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
