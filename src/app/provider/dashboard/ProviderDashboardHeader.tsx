"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ProviderDashboardHeader({ name, email }: { name: string; email: string }) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-950">{name}</h1>
          <p className="text-sm text-emerald-700">{email}</p>
        </div>
        <LogoutButton redirectTo="/" />
      </div>

      <Link
        href="/provider/orders"
        className="mb-6 block rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
      >
        <h2 className="font-medium text-stone-900">{t("providerDashboard.orders")}</h2>
        <p className="mt-1 text-sm text-stone-500">{t("providerDashboard.ordersHint")}</p>
      </Link>
    </>
  );
}

export function FleetSection({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="mb-6 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-medium text-stone-900">{t("providerDashboard.fleetPricing")}</h2>
      {children}
    </div>
  );
}

export function RosterSection({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-medium text-stone-900">{t("providerDashboard.pilotRoster")}</h2>
      {children}
    </div>
  );
}
