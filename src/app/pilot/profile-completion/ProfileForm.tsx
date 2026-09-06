"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Pilot } from "@prisma/client";

export default function ProfileForm({ pilot }: { pilot: Pilot }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: pilot.name,
    phone: pilot.phone,
    village: pilot.village,
    mandal: pilot.mandal,
    district: pilot.district,
    pincode: pilot.pincode ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/pilot/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save profile");
        return;
      }
      router.push("/pilot/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Full name">
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Phone">
        <input
          required
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Village">
        <input
          required
          value={form.village}
          onChange={(e) => update("village", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Mandal">
        <input
          required
          value={form.mandal}
          onChange={(e) => update("mandal", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="District">
        <input
          required
          value={form.district}
          onChange={(e) => update("district", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Pincode">
        <input
          required
          value={form.pincode}
          onChange={(e) => update("pincode", e.target.value)}
          className={inputClass}
          placeholder="534199"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save & Submit"}
      </button>
    </form>
  );
}

const inputClass =
  "rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
      {label}
      {children}
    </label>
  );
}
