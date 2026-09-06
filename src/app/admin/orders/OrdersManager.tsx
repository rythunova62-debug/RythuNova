"use client";

import { useCallback, useEffect, useState } from "react";

type Candidate = { id: string; name: string; matchReason: string };

type Order = {
  id: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  address: string;
  pincode: string;
  acres: number;
  cropType: string;
  sprayDetails: string;
  scheduledAt: string;
  status: string;
  proofVideoKey: string | null;
  assignedPilot: { id: string; name: string; phone: string } | null;
  assignedProvider: { id: string; name: string } | null;
  candidatePilots: Candidate[];
  candidateProviders: Candidate[];
};

const emptyForm = {
  farmerName: "",
  farmerPhone: "",
  village: "",
  address: "",
  pincode: "",
  acres: "",
  cropType: "",
  sprayDetails: "",
  scheduledAt: "",
};

const statusStyles: Record<string, string> = {
  unassigned: "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
};

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, acres: Number(form.acres) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create order");
        return;
      }
      setForm(emptyForm);
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function assign(orderId: string, type: "pilot" | "provider", id: string) {
    setError(null);
    setBusyId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not assign order");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-medium text-stone-900">Add Farmer Booking</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input required placeholder="Farmer name" value={form.farmerName} onChange={(e) => setForm((f) => ({ ...f, farmerName: e.target.value }))} className={inputClass} />
          <input required placeholder="Phone" value={form.farmerPhone} onChange={(e) => setForm((f) => ({ ...f, farmerPhone: e.target.value }))} className={inputClass} />
          <input required placeholder="Village" value={form.village} onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))} className={inputClass} />
          <input required placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={`${inputClass} sm:col-span-2`} />
          <input required placeholder="Pincode" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} className={inputClass} />
          <input required type="number" step="0.1" placeholder="Acres" value={form.acres} onChange={(e) => setForm((f) => ({ ...f, acres: e.target.value }))} className={inputClass} />
          <input required placeholder="Crop type" value={form.cropType} onChange={(e) => setForm((f) => ({ ...f, cropType: e.target.value }))} className={inputClass} />
          <input required placeholder="Spray/fertilizer details" value={form.sprayDetails} onChange={(e) => setForm((f) => ({ ...f, sprayDetails: e.target.value }))} className={`${inputClass} sm:col-span-1`} />
          <input required type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} className={`${inputClass} sm:col-span-3`} />
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
          <button type="submit" disabled={creating} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50 sm:col-span-3 sm:w-fit">
            {creating ? "Adding..." : "Add booking"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-stone-900">All Orders</h2>
        {orders === null && <p className="text-sm text-stone-500">Loading...</p>}
        {orders?.length === 0 && <p className="text-sm text-stone-500">No orders yet.</p>}
        {orders?.map((o) => (
          <div key={o.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-stone-900">{o.farmerName}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-sm text-stone-500">{o.farmerPhone}</p>
                <p className="text-sm text-stone-500">{o.address}, {o.village} — {o.pincode}</p>
                <p className="text-sm text-stone-500">{o.acres} acres · {o.cropType} · {o.sprayDetails}</p>
                <p className="text-sm text-stone-500">Scheduled: {new Date(o.scheduledAt).toLocaleString()}</p>
              </div>
              {o.proofVideoKey && (
                <a href={`/api/files/${o.proofVideoKey}`} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 hover:underline">
                  View proof video
                </a>
              )}
            </div>

            {o.status === "unassigned" && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-stone-100 pt-4 sm:grid-cols-2">
                <CandidateList
                  title="Matching Pilots"
                  candidates={o.candidatePilots}
                  empty="No verified pilots match this location yet."
                  disabled={busyId === o.id}
                  onAssign={(id) => assign(o.id, "pilot", id)}
                />
                <CandidateList
                  title="Matching Providers"
                  candidates={o.candidateProviders}
                  empty="No providers match this postal region yet."
                  disabled={busyId === o.id}
                  onAssign={(id) => assign(o.id, "provider", id)}
                />
              </div>
            )}

            {o.status !== "unassigned" && (
              <p className="mt-3 border-t border-stone-100 pt-3 text-sm text-stone-600">
                Assigned to: {o.assignedPilot ? `${o.assignedPilot.name} (pilot)` : o.assignedProvider ? `${o.assignedProvider.name} (provider)` : "—"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateList({
  title,
  candidates,
  empty,
  disabled,
  onAssign,
}: {
  title: string;
  candidates: Candidate[];
  empty: string;
  disabled: boolean;
  onAssign: (id: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-stone-700">{title}</h4>
      {candidates.length === 0 ? (
        <p className="text-sm text-stone-400">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {candidates.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-2 text-sm">
              <div>
                <div className="font-medium text-stone-800">{c.name}</div>
                <div className="text-xs text-stone-400">{c.matchReason}</div>
              </div>
              <button
                disabled={disabled}
                onClick={() => onAssign(c.id)}
                className="rounded-md bg-emerald-700 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-40"
              >
                Assign
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputClass = "rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none";
