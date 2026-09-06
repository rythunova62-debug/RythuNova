"use client";

import { useCallback, useEffect, useState } from "react";

type Provider = {
  id: string;
  name: string;
  address: string;
  pincode: string;
  coverageRadiusKm: number;
  totalDrones: number;
  acresPerDayCapacity: number;
  pricePerAcre: number;
  bulkDiscountThreshold: number | null;
  bulkDiscountPercent: number | null;
  isActive: boolean;
  pilotCount: number;
  activePilotCount: number;
  totalAcresSprayed: number;
  user: {
    email: string;
    username: string | null;
    accountStatus: string;
    deletedAt: string | null;
    lastLoginAt: string | null;
    lastLoginIp: string | null;
    lastLogoutAt: string | null;
  };
};

const POLL_INTERVAL_MS = 8000;

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function ProvidersTable() {
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/providers");
    const data = await res.json();
    setProviders(data.providers ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  async function act(id: string, action: "block" | "delete") {
    const confirmMsg =
      action === "block"
        ? "Block this provider? They will be unable to log in."
        : "Permanently delete this provider account? This cannot be undone from the UI.";
    if (!window.confirm(confirmMsg)) return;

    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/providers/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Action failed");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (providers === null) {
    return <p className="text-sm text-stone-500">Loading providers...</p>;
  }

  if (providers.length === 0) {
    return <p className="text-sm text-stone-500">No providers have registered yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {providers.map((p) => (
        <div key={p.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-medium text-stone-900">{p.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-stone-400"}`}
                  />
                  {p.isActive ? "online" : "offline"}
                </span>
                {p.user.deletedAt && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    deleted
                  </span>
                )}
                {!p.user.deletedAt && p.user.accountStatus === "blocked" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    blocked
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500">
                {p.user.email} · @{p.user.username ?? "—"}
              </p>
              <p className="text-sm text-stone-500">
                {p.address}, {p.pincode}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                disabled={busyId === p.id || !!p.user.deletedAt}
                onClick={() => act(p.id, "block")}
                className="rounded-md border border-amber-300 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-40"
              >
                Block
              </button>
              <button
                disabled={busyId === p.id || !!p.user.deletedAt}
                onClick={() => act(p.id, "delete")}
                className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 text-sm sm:grid-cols-4">
            <Stat label="Coverage" value={`${p.coverageRadiusKm} km`} />
            <Stat label="Drones" value={p.totalDrones} />
            <Stat label="Acres/day capacity" value={p.acresPerDayCapacity} />
            <Stat label="Price/acre" value={`₹${p.pricePerAcre}`} />
            <Stat label="Pilots" value={`${p.activePilotCount} active / ${p.pilotCount} total`} />
            <Stat label="Acres sprayed (roster total)" value={p.totalAcresSprayed} />
            <Stat
              label="Bulk discount"
              value={
                p.bulkDiscountThreshold && p.bulkDiscountPercent
                  ? `${p.bulkDiscountPercent}% above ${p.bulkDiscountThreshold} acres`
                  : "—"
              }
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-1 border-t border-stone-100 pt-3 text-xs text-stone-500 sm:grid-cols-3">
            <span>Last login: {formatTime(p.user.lastLoginAt)}</span>
            <span>Last logout: {formatTime(p.user.lastLogoutAt)}</span>
            <span>Last login IP: {p.user.lastLoginIp ?? "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="font-medium text-stone-900">{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  );
}
