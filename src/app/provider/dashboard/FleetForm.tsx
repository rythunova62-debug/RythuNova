"use client";

import { useState } from "react";
import type { Provider } from "@prisma/client";

const inputClass =
  "rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none";

export default function FleetForm({ provider }: { provider: Provider }) {
  const [form, setForm] = useState({
    coverageRadiusKm: provider.coverageRadiusKm,
    totalDrones: provider.totalDrones,
    acresPerDayCapacity: provider.acresPerDayCapacity,
    pricePerAcre: provider.pricePerAcre,
    bulkDiscountThreshold: provider.bulkDiscountThreshold ?? "",
    bulkDiscountPercent: provider.bulkDiscountPercent ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value === "" ? "" : Number(value) }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/provider/fleet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bulkDiscountThreshold: form.bulkDiscountThreshold === "" ? null : form.bulkDiscountThreshold,
          bulkDiscountPercent: form.bulkDiscountPercent === "" ? null : form.bulkDiscountPercent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save");
        return;
      }
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Coverage radius (km)
        <input
          type="number"
          min={0}
          value={form.coverageRadiusKm}
          onChange={(e) => update("coverageRadiusKm", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Total drones
        <input
          type="number"
          min={0}
          value={form.totalDrones}
          onChange={(e) => update("totalDrones", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Acres/day capacity
        <input
          type="number"
          min={0}
          value={form.acresPerDayCapacity}
          onChange={(e) => update("acresPerDayCapacity", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Price per acre (₹)
        <input
          type="number"
          min={0}
          step="0.01"
          value={form.pricePerAcre}
          onChange={(e) => update("pricePerAcre", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Bulk discount above (acres)
        <input
          type="number"
          min={0}
          value={form.bulkDiscountThreshold}
          onChange={(e) => update("bulkDiscountThreshold", e.target.value)}
          className={inputClass}
          placeholder="e.g. 50"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        Discount (%)
        <input
          type="number"
          min={0}
          max={100}
          value={form.bulkDiscountPercent}
          onChange={(e) => update("bulkDiscountPercent", e.target.value)}
          className={inputClass}
          placeholder="e.g. 10"
        />
      </label>

      {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
      {saved && <p className="col-span-2 text-sm text-emerald-700">Saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="col-span-2 mt-1 w-fit btn-glow rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
