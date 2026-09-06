"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed right-4 top-4 z-40 flex overflow-hidden rounded-full border border-stone-300 bg-white text-xs font-medium shadow-sm">
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1.5 transition ${locale === "en" ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-50"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("te")}
        className={`px-3 py-1.5 transition ${locale === "te" ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-50"}`}
      >
        తెలుగు
      </button>
    </div>
  );
}
