"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const hasLinkError = searchParams.get("linkError") === "1";
  const { t } = useLanguage();

  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleResend() {
    setError(null);
    setInfo(null);
    const res = await fetch("/api/pilot/signup/resend-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not resend email");
      return;
    }
    setInfo(t("checkEmail.resent"));
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
      <div className="w-full max-w-sm rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("checkEmail.title")}</h1>
        <p className="mb-2 text-sm text-emerald-700">
          {t("checkEmail.sentTo")} <span className="font-medium">{email}</span>.
        </p>
        <p className="mb-6 text-sm text-stone-600">{t("checkEmail.instructions")}</p>

        {hasLinkError && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {t("checkEmail.linkError")}
          </p>
        )}
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {info && <p className="mb-4 text-sm text-emerald-700">{info}</p>}

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="w-full rounded-md border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendCooldown > 0 ? `${t("checkEmail.resendIn")} ${resendCooldown}s` : t("checkEmail.resend")}
        </button>

        <Link href="/" className="mt-6 block text-center text-sm text-stone-400 hover:text-stone-600">
          {t("common.backHome")}
        </Link>
      </div>
    </main>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  );
}
