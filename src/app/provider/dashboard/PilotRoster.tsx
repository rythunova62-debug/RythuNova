"use client";

import { useCallback, useEffect, useState } from "react";

type ProviderPilot = {
  id: string;
  name: string;
  age: number | null;
  experienceYears: number;
  acresSprayed: number;
  active: boolean;
};

const emptyForm = { name: "", age: "", experienceYears: "", acresSprayed: "" };

export default function PilotRoster() {
  const [pilots, setPilots] = useState<ProviderPilot[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/provider/pilots");
    const data = await res.json();
    setPilots(data.pilots ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAdding(true);
    try {
      const res = await fetch("/api/provider/pilots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: form.age === "" ? null : Number(form.age),
          experienceYears: Number(form.experienceYears || 0),
          acresSprayed: Number(form.acresSprayed || 0),
          active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add pilot");
        return;
      }
      setForm(emptyForm);
      await load();
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(pilot: ProviderPilot) {
    setBusyId(pilot.id);
    try {
      await fetch(`/api/provider/pilots/${pilot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pilot, active: !pilot.active }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this pilot from your roster?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/provider/pilots/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (pilots === null) {
    return <p className="text-sm text-stone-500">Loading roster...</p>;
  }

  const activeCount = pilots.filter((p) => p.active).length;
  const totalAcres = pilots.reduce((sum, p) => sum + p.acresSprayed, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md bg-emerald-50 p-3">
          <div className="text-xl font-semibold text-emerald-900">{pilots.length}</div>
          <div className="text-xs text-emerald-700">Total Pilots</div>
        </div>
        <div className="rounded-md bg-emerald-50 p-3">
          <div className="text-xl font-semibold text-emerald-900">{activeCount}</div>
          <div className="text-xs text-emerald-700">Active</div>
        </div>
        <div className="rounded-md bg-emerald-50 p-3">
          <div className="text-xl font-semibold text-emerald-900">{totalAcres}</div>
          <div className="text-xs text-emerald-700">Acres Sprayed (total)</div>
        </div>
      </div>

      {pilots.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Age</th>
                <th className="px-3 py-2 font-medium">Experience (yrs)</th>
                <th className="px-3 py-2 font-medium">Acres sprayed</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pilots.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 font-medium text-stone-900">{p.name}</td>
                  <td className="px-3 py-2 text-stone-600">{p.age ?? "—"}</td>
                  <td className="px-3 py-2 text-stone-600">{p.experienceYears}</td>
                  <td className="px-3 py-2 text-stone-600">{p.acresSprayed}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        p.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {p.active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        disabled={busyId === p.id}
                        onClick={() => toggleActive(p)}
                        className="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                      >
                        {p.active ? "Mark inactive" : "Mark active"}
                      </button>
                      <button
                        disabled={busyId === p.id}
                        onClick={() => remove(p.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 sm:grid-cols-4">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="col-span-2 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none sm:col-span-1"
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Experience (yrs)"
          value={form.experienceYears}
          onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Acres sprayed"
          value={form.acresSprayed}
          onChange={(e) => setForm((f) => ({ ...f, acresSprayed: e.target.value }))}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
        />
        {error && <p className="col-span-2 text-sm text-red-600 sm:col-span-4">{error}</p>}
        <button
          type="submit"
          disabled={adding}
          className="col-span-2 btn-glow rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50 sm:col-span-4 sm:w-fit"
        >
          {adding ? "Adding..." : "Add pilot to roster"}
        </button>
      </form>
    </div>
  );
}
