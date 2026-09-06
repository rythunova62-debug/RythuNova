"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import VideoBackground from "@/components/VideoBackground";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden px-6 py-12 text-center">
      <VideoBackground src="/videos/home.mp4" />
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-950/40 px-8 py-6 backdrop-blur-[2px]">
        <h1
          className="animate-fade-in-up text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl"
          style={{ animationDelay: "100ms" }}
        >
          {t("home.title")}
        </h1>
        <p
          className="animate-fade-in-up max-w-md text-balance text-white/95 drop-shadow"
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
          className="btn-glow rounded-lg bg-emerald-600 px-8 py-3 font-medium text-white shadow-lg"
        >
          {t("home.pilotLogin")}
        </Link>
        <Link
          href="/auth/provider/login"
          className="btn-glow rounded-lg border border-white/70 bg-white/90 px-8 py-3 font-medium text-emerald-800 shadow-lg backdrop-blur"
        >
          {t("home.providerLogin")}
        </Link>
      </div>
    </main>
  );
}
