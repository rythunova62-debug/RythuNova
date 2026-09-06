"use client";

import Link from "next/link";
import OrdersList from "@/components/OrdersList";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function PilotOrdersContent({ verified }: { verified: boolean }) {
  const { t } = useLanguage();

  if (!verified) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16 text-center">
        <div className="w-full max-w-md rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-xl font-semibold text-emerald-900">{t("orders.notAvailableTitle")}</h1>
          <p className="text-sm text-stone-600">{t("orders.notAvailableBody")}</p>
          <Link href="/pilot/dashboard" className="mt-4 inline-block text-sm text-emerald-700 hover:underline">
            {t("orders.dashboard")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-emerald-950">{t("orders.myOrders")}</h1>
          <Link href="/pilot/dashboard" className="text-sm text-emerald-700 hover:underline">
            ← {t("orders.dashboard")}
          </Link>
        </div>
        <OrdersList apiBase="/api/pilot/orders" />
      </div>
    </main>
  );
}
