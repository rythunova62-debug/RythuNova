"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { t } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset password");
        return;
      }
      router.push("/?passwordReset=1");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-red-600">{t("resetPassword.missingToken")}</p>
        <Link href="/auth/forgot-password" className="mt-4 inline-block text-sm text-emerald-700 hover:underline">
          {t("resetPassword.requestNew")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="mb-1 text-2xl font-semibold text-stone-900">{t("resetPassword.title")}</h1>
      <p className="mb-6 text-sm text-stone-500">{t("resetPassword.subtitle")}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
          {t("credentials.newPassword")}
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
          {t("common.confirmPassword")}
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 btn-glow rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? t("common.saving") : t("resetPassword.reset")}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-stone-50 px-6 py-16">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
