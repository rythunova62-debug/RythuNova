"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import HeroIllustration from "@/components/HeroIllustration";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-b from-emerald-50 to-white px-6 py-12 text-center">
      <div className="w-full max-w-md animate-fade-in-up">
        <HeroIllustration />
      </div>

      <div className="flex flex-col gap-3">
        <h1
          className="animate-fade-in-up text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl"
          style={{ animationDelay: "100ms" }}
        >
          {t("home.title")}
        </h1>
        <p
          className="animate-fade-in-up max-w-md text-balance text-emerald-700"
          style={{ animationDelay: "220ms" }}
        >
          {t("home.tagline")}
        </p>
      </div>

      <div
        className="animate-fade-in-up flex flex-col gap-4 sm:flex-row"
        style={{ animationDelay: "340ms" }}
      >
        <Link
          href="/auth/pilot/login"
          className="btn-glow rounded-lg bg-emerald-700 px-8 py-3 font-medium text-white"
        >
          {t("home.pilotLogin")}
        </Link>
        <Link
          href="/auth/provider/login"
          className="btn-glow rounded-lg border border-emerald-700 bg-white px-8 py-3 font-medium text-emerald-800"
        >
          {t("home.providerLogin")}
        </Link>
      </div>
    </main>
  );
}
