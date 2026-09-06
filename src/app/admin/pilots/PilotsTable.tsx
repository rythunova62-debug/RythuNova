"use client";

import { useEffect, useState, useCallback } from "react";
import DocumentViewerModal from "./DocumentViewerModal";

type Pilot = {
  id: string;
  name: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  licenceFileKey: string | null;
  photoFileKey: string | null;
  verificationStatus: string;
  rejectionReason: string | null;
  rating: number | null;
  profileComplete: boolean;
  user: { email: string; accountStatus: string; deletedAt: string | null };
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function PilotsTable() {
  const [pilots, setPilots] = useState<Pilot[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Pilot | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/pilots");
    const data = await res.json();
    setPilots(data.pilots ?? []);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: setState happens after the awaited fetch resolves, not
    // synchronously in the effect body, so this is the standard data-loading
    // pattern rather than the cascading-render case the lint rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function act(id: string, action: string, body?: Record<string, unknown>) {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/pilots/${id}/${action}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
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

  function handleReject(id: string) {
    const reason = window.prompt("Reason for rejecting this pilot's licence:");
    if (!reason) return;
    act(id, "reject", { reason });
  }

  function handleRate(id: string, current: number | null) {
    const input = window.prompt("Rate this pilot (1-5):", current ? String(current) : "");
    if (!input) return;
    const rating = Number(input);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setError("Rating must be a number between 1 and 5");
      return;
    }
    act(id, "rate", { rating });
  }

  function handleBlock(id: string) {
    if (!window.confirm("Block this pilot? They will be unable to log in.")) return;
    act(id, "block");
  }

  function handleDelete(id: string) {
    if (!window.confirm("Permanently delete this pilot account? This cannot be undone from the UI.")) return;
    act(id, "delete");
  }

  if (pilots === null) {
    return <p className="text-sm text-stone-500">Loading pilots...</p>;
  }

  if (pilots.length === 0) {
    return <p className="text-sm text-stone-500">No pilots have registered yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
      {error && <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-50 text-left text-stone-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email / Phone</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Documents</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Account</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {pilots.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium text-stone-900">{p.name}</td>
              <td className="px-4 py-3 text-stone-600">
                <div>{p.user.email}</div>
                <div className="text-xs text-stone-400">{p.phone}</div>
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.village}, {p.mandal}, {p.district}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => setViewing(p)}
                  className="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  View licence & photo
                </button>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[p.verificationStatus]}`}>
                  {p.verificationStatus}
                </span>
                {p.verificationStatus === "rejected" && p.rejectionReason && (
                  <div className="mt-1 text-xs text-stone-400">{p.rejectionReason}</div>
                )}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.rating ? `★ ${p.rating}` : <span className="text-stone-400">Not rated</span>}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.user.deletedAt ? "deleted" : p.user.accountStatus}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busyId === p.id || p.verificationStatus === "verified"}
                    onClick={() => act(p.id, "verify")}
                    className="rounded-md bg-emerald-700 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-40"
                  >
                    Verify
                  </button>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => handleReject(p.id)}
                    className="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                  >
                    Reject
                  </button>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => handleRate(p.id, p.rating)}
                    className="rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                  >
                    Rate
                  </button>
                  <button
                    disabled={busyId === p.id || !!p.user.deletedAt}
                    onClick={() => handleBlock(p.id)}
                    className="rounded-md border border-amber-300 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-40"
                  >
                    Block
                  </button>
                  <button
                    disabled={busyId === p.id || !!p.user.deletedAt}
                    onClick={() => handleDelete(p.id)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewing && (
        <DocumentViewerModal
          name={viewing.name}
          licenceFileKey={viewing.licenceFileKey}
          photoFileKey={viewing.photoFileKey}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
