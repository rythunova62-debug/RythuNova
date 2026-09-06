"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import SceneBackground from "@/components/SceneBackground";

type PilotData = {
  name: string;
  rating: number | null;
  verificationStatus: string;
  rejectionReason: string | null;
};

export default function PilotDashboardContent({ pilot, email }: { pilot: PilotData; email: string }) {
  const { t } = useLanguage();

  const statusCopy: Record<string, { label: string; tone: string; message: string }> = {
    pending: {
      label: t("pilotDashboard.statusPending"),
      tone: "bg-amber-100 text-amber-800",
      message: t("pilotDashboard.messagePending"),
    },
    verified: {
      label: t("pilotDashboard.statusVerified"),
      tone: "bg-emerald-100 text-emerald-800",
      message: t("pilotDashboard.messageVerified"),
    },
    rejected: {
      label: t("pilotDashboard.statusRejected"),
      tone: "bg-red-100 text-red-800",
      message: t("pilotDashboard.messageRejected"),
    },
  };

  const status = statusCopy[pilot.verificationStatus] ?? statusCopy.pending;

  return (
    <main className="relative isolate flex flex-1 flex-col overflow-hidden px-6 py-10">
      <SceneBackground scene="pilot-dashboard" />
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-950">{pilot.name}</h1>
            <p className="text-sm text-emerald-700">{email}</p>
          </div>
          <LogoutButton redirectTo="/" />
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.tone}`}>
              {status.label}
            </span>
            {pilot.rating != null && (
              <span className="text-xs font-medium text-amber-600">
                ★ {pilot.rating} {t("pilotDashboard.rating")}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-stone-600">{status.message}</p>
          {pilot.verificationStatus === "rejected" && pilot.rejectionReason && (
            <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {t("pilotDashboard.reason")}: {pilot.rejectionReason}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/pilot/profile-completion"
            className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">{t("pilotDashboard.editProfile")}</h2>
            <p className="mt-1 text-sm text-stone-500">{t("pilotDashboard.editProfileHint")}</p>
          </Link>
          {pilot.verificationStatus === "verified" ? (
            <Link
              href="/pilot/orders"
              className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <h2 className="font-medium text-stone-900">{t("pilotDashboard.orders")}</h2>
              <p className="mt-1 text-sm text-stone-500">{t("pilotDashboard.ordersHint")}</p>
            </Link>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-stone-100 p-6 opacity-60">
              <h2 className="font-medium text-stone-500">{t("pilotDashboard.orders")}</h2>
              <p className="mt-1 text-sm text-stone-400">{t("pilotDashboard.ordersLocked")}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
