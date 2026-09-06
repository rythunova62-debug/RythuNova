"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { t } = useLanguage();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/pilot/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }
      router.push(`/auth/pilot/create-credentials?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    const res = await fetch("/api/pilot/signup/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not resend OTP");
      return;
    }
    setInfo("A new OTP has been sent.");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("otp.title")}</h1>
        <p className="mb-6 text-sm text-emerald-700">
          {t("otp.sentTo")} <span className="font-medium">{email}</span>. {t("otp.expiresIn")}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            OTP
            <input
              required
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="rounded-md border border-stone-300 px-3 py-2 text-center text-lg tracking-widest focus:border-emerald-600 focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="mt-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? t("otp.verifying") : t("otp.verify")}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="mt-4 w-full text-center text-sm text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:text-stone-400"
        >
          {resendCooldown > 0 ? `${t("otp.resendIn")} ${resendCooldown}s` : t("otp.resend")}
        </button>

        <Link href="/" className="mt-6 block text-center text-sm text-stone-400 hover:text-stone-600">
          {t("common.backHome")}
        </Link>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
