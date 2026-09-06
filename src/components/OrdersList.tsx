"use client";

import { useCallback, useEffect, useState } from "react";

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
};

type Counters = { total: number; pending: number; completed: number; totalAcres: number };

const statusStyles: Record<string, string> = {
  assigned: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
};

// Nudges pilots toward a short clip matching the ~7-8s proof requirement.
// Client-side only — not a security boundary, just a data-quality check.
const MIN_DURATION_S = 3;
const MAX_DURATION_S = 15;

function checkVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("Could not read video"));
    video.src = URL.createObjectURL(file);
  });
}

export default function OrdersList({ apiBase }: { apiBase: "/api/pilot/orders" | "/api/provider/orders" }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [counters, setCounters] = useState<Counters | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(apiBase);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setCounters(data.counters ?? null);
  }, [apiBase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleComplete(orderId: string, file: File) {
    setError(null);

    try {
      const duration = await checkVideoDuration(file);
      if (duration < MIN_DURATION_S || duration > MAX_DURATION_S) {
        setError(
          `Video is ${duration.toFixed(1)}s — please upload a short clip (around 7-8 seconds, ${MIN_DURATION_S}-${MAX_DURATION_S}s accepted).`
        );
        return;
      }
    } catch {
      // If duration can't be read (unsupported format in-browser), let the server validate instead.
    }

    setUploadingId(orderId);
    try {
      const body = new FormData();
      body.append("video", file);
      const res = await fetch(`${apiBase}/${orderId}/complete`, { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not complete order");
        return;
      }
      await load();
    } finally {
      setUploadingId(null);
    }
  }

  if (orders === null) {
    return <p className="text-sm text-stone-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {counters && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total orders" value={counters.total} />
          <Stat label="Pending" value={counters.pending} />
          <Stat label="Completed" value={counters.completed} />
          <Stat label="Acres sprayed" value={counters.totalAcres} />
        </div>
      )}

      {error && <p className="rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-sm text-stone-500">No orders assigned yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-stone-900">{o.farmerName}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[o.status]}`}>
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-stone-500">{o.farmerPhone}</p>
              <p className="text-sm text-stone-500">{o.address}, {o.village} — {o.pincode}</p>
              <p className="text-sm text-stone-500">{o.acres} acres · {o.cropType} · {o.sprayDetails}</p>
              <p className="text-sm text-stone-500">Scheduled: {new Date(o.scheduledAt).toLocaleString()}</p>

              {o.status === "assigned" && (
                <div className="mt-3 border-t border-stone-100 pt-3">
                  <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
                    Upload proof video (~7-8 seconds) to complete
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      disabled={uploadingId === o.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleComplete(o.id, file);
                      }}
                      className="text-sm"
                    />
                  </label>
                  {uploadingId === o.id && <p className="mt-1 text-xs text-stone-400">Uploading...</p>}
                </div>
              )}

              {o.status === "completed" && o.proofVideoKey && (
                <a
                  href={`/api/files/${o.proofVideoKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block border-t border-stone-100 pt-3 text-sm text-emerald-700 hover:underline"
                >
                  View submitted proof video
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white p-3 text-center shadow-sm">
      <div className="text-xl font-semibold text-emerald-900">{value}</div>
      <div className="text-xs text-emerald-700">{label}</div>
    </div>
  );
}
