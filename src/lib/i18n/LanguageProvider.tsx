"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";

const STORAGE_KEY = "rythunova-locale";

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Reading the saved preference after mount (localStorage isn't available
    // during SSR) — not the cascading-render case the lint rule targets.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "en" || stored === "te") setLocaleState(stored);
    } catch {
      // localStorage unavailable (private browsing etc.) — default to English.
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }

  function t(key: TranslationKey): string {
    return translations[key]?.[locale] ?? translations[key]?.en ?? key;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
