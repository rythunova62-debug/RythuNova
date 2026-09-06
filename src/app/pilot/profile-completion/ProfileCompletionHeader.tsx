"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ProfileCompletionHeader() {
  const { t } = useLanguage();
  return (
    <>
      <Link href="/pilot/dashboard" className="mb-4 inline-block text-sm text-emerald-700 hover:underline">
        ← {t("common.backToDashboard")}
      </Link>
      <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("profileCompletion.title")}</h1>
      <p className="mb-6 text-sm text-emerald-700">{t("profileCompletion.subtitle")}</p>
    </>
  );
}
