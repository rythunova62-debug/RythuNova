"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SceneBackground from "@/components/SceneBackground";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const hasLinkError = searchParams.get("linkError") === "1";

  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleResend() {
    setError(null);
    setInfo(null);
    const res = await fetch("/api/auth/admin/resend-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not resend email");
      return;
    }
    setInfo("Verification email sent again.");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <SceneBackground scene="admin-login" />
      <div className="w-full max-w-sm rounded-xl border border-white/15 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Check your email</h1>
        <p className="mb-2 text-sm text-emerald-300">
          We sent a verification link to <span className="font-medium">{email}</span>.
        </p>
        <p className="mb-6 text-sm text-slate-400">
          Click it to set your password. The link expires in 30 minutes and works once.
        </p>

        {hasLinkError && (
          <p className="mb-4 rounded-md bg-red-500/15 px-3 py-2 text-sm text-red-300">
            That link is invalid or has expired. Send yourself a new one.
          </p>
        )}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        {info && <p className="mb-4 text-sm text-emerald-300">{info}</p>}

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="w-full rounded-md border border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
        </button>

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

export default function AdminCheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  );
}
