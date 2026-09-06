"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SceneBackground from "@/components/SceneBackground";

function CreateCredentialsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/create-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create the account");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <SceneBackground scene="admin-login" />
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Set your password</h1>
        <p className="mb-6 text-sm text-emerald-300">
          Email verified: <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-white/20 bg-slate-950/50 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
            <span className="text-xs font-normal text-slate-400">At least 8 characters</span>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-200">
            Confirm password
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-md border border-white/20 bg-slate-950/50 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow mt-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <Link
          href="/auth/admin/login"
          className="mt-6 block text-center text-sm text-slate-400 hover:text-slate-200"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}

export default function AdminCreateCredentialsPage() {
  return (
    <Suspense fallback={null}>
      <CreateCredentialsForm />
    </Suspense>
  );
}
