"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import VideoBackground from "@/components/VideoBackground";
import PaddyRow from "@/components/PaddyRow";

function PilotLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get("created") === "1";
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/pilot/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/pilot/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <VideoBackground src="/videos/pilot-login.mp4" />
      <PaddyRow />
      <div className="w-full max-w-[17rem] rounded-xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur-md">
        <h1 className="mb-1 text-xl font-semibold text-emerald-900">{t("pilotLogin.title")}</h1>
        <p className="mb-4 text-xs text-emerald-700">{t("pilotLogin.subtitle")}</p>

        {justCreated && (
          <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {t("common.accountCreated")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-stone-700">
            {t("common.email")}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-stone-700">
            {t("common.password")}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 btn-glow rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? t("common.signingIn") : t("common.signIn")}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-1.5 text-xs">
          <Link href="/auth/pilot/signup" className="text-emerald-700 hover:underline">
            {t("pilotLogin.newPilot")}
          </Link>
          <Link href="/auth/forgot-password" className="text-stone-500 hover:underline">
            {t("pilotLogin.forgotPassword")}
          </Link>
          <Link href="/" className="text-stone-500 hover:text-stone-700">
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PilotLoginPage() {
  return (
    <Suspense fallback={null}>
      <PilotLoginForm />
    </Suspense>
  );
}
