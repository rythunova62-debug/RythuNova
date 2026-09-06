"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SceneBackground from "@/components/SceneBackground";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(`/auth/admin/check-email?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <SceneBackground scene="admin-login" />
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Register Team Member</h1>
        <p className="mb-6 text-sm text-emerald-300">
          We&apos;ll email you a link to verify your address.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-white/20 bg-slate-950/50 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow mt-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Sending link..." : "Send verification link"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link href="/auth/admin/login" className="text-emerald-300 hover:underline">
            Already on the team? Sign in
          </Link>
          <Link href="/" className="text-slate-400 hover:text-slate-200">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
