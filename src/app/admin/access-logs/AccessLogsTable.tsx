"use client";

import { useEffect, useState, useCallback } from "react";

type UserRow = {
  id: string;
  role: string;
  email: string;
  username: string | null;
  name: string | null;
  accountStatus: string;
  deletedAt: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastLogoutAt: string | null;
  isActive: boolean;
};

const roleFilters = ["all", "admin", "pilot", "provider"] as const;

function formatTime(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString();
}

export default function AccessLogsTable() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [roleFilter, setRoleFilter] = useState<(typeof roleFilters)[number]>("all");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/access-logs");
    const data = await res.json();
    setUsers(data.users ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  if (users === null) {
    return <p className="text-sm text-stone-500">Loading...</p>;
  }

  const filtered = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {roleFilters.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              roleFilter === r ? "bg-stone-800 text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name / Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Last Login IP</th>
              <th className="px-4 py-3 font-medium">Last Logout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{u.name ?? u.username ?? u.email}</div>
                  <div className="text-xs text-stone-400">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-stone-600 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-stone-400"}`} />
                    {u.isActive ? "online" : "offline"}
                  </span>
                  {u.deletedAt && <span className="ml-2 text-xs text-red-600">deleted</span>}
                  {!u.deletedAt && u.accountStatus === "blocked" && (
                    <span className="ml-2 text-xs text-amber-700">blocked</span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">{formatTime(u.lastLoginAt)}</td>
                <td className="px-4 py-3 text-stone-600">{u.lastLoginIp ?? "—"}</td>
                <td className="px-4 py-3 text-stone-600">{formatTime(u.lastLogoutAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
