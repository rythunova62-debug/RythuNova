"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const inputClass =
  "rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", address: "", pincode: "" });
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
      const res = await fetch("/api/provider/signup/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(`/auth/provider/check-email?email=${encodeURIComponent(form.email)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("providerRegister.title")}</h1>
        <p className="mb-6 text-sm text-emerald-700">{t("providerRegister.subtitle")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {t("providerRegister.companyName")}
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {t("common.email")}
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {t("common.address")}
            <input
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
            {t("common.pincode")}
            <input
              required
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value)}
              className={inputClass}
              placeholder="534001"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 btn-glow rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? t("providerRegister.sendingOtp") : t("common.continue")}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link href="/auth/provider/login" className="text-emerald-700 hover:underline">
            {t("providerRegister.alreadyRegistered")}
          </Link>
          <Link href="/" className="text-stone-400 hover:text-stone-600">
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
