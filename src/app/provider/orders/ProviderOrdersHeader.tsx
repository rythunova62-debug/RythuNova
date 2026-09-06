"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ProviderOrdersHeader() {
  const { t } = useLanguage();
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-emerald-950">{t("orders.myOrders")}</h1>
      <Link href="/provider/dashboard" className="text-sm text-emerald-700 hover:underline">
        ← {t("orders.dashboard")}
      </Link>
    </div>
  );
}
