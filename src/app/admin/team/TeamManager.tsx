"use client";

import { useCallback, useEffect, useState } from "react";

type Admin = {
  id: string;
  email: string;
  accountStatus: string;
  deletedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

export default function TeamManager({ currentAdminId }: { currentAdminId: string }) {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setAdmins(data.admins ?? []);
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
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create admin");
        return;
      }
      setEmail("");
      setPassword("");
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(id: string) {
    if (!window.confirm("Remove this admin's access? This cannot be undone from the UI.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not remove admin");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-medium text-stone-900">Add Admin</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Temporary password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900 disabled:opacity-50"
        >
          {creating ? "Adding..." : "Add admin"}
        </button>
      </form>

      {admins === null ? (
        <p className="text-sm text-stone-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {a.email}
                    {a.id === currentAdminId && <span className="ml-2 text-xs text-stone-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {a.deletedAt ? "removed" : a.accountStatus}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    {a.id !== currentAdminId && !a.deletedAt && (
                      <button
                        disabled={busyId === a.id}
                        onClick={() => handleRemove(a.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
