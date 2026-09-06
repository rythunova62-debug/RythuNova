"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ProfileCompletionHeader() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("profileCompletion.title")}</h1>
      <p className="mb-6 text-sm text-emerald-700">{t("profileCompletion.subtitle")}</p>
    </>
  );
}
