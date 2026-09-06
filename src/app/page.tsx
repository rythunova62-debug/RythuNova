"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Hero from "@/components/hero3d/Hero";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-b from-emerald-50 to-white px-6 py-12 text-center">
      <div className="w-full max-w-md">
        <Hero />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="max-w-md text-balance text-emerald-700">{t("home.tagline")}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/auth/pilot/login"
          className="rounded-lg bg-emerald-700 px-8 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-800"
        >
          {t("home.pilotLogin")}
        </Link>
        <Link
          href="/auth/provider/login"
          className="rounded-lg border border-emerald-700 px-8 py-3 font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          {t("home.providerLogin")}
        </Link>
      </div>
    </main>
  );
}
