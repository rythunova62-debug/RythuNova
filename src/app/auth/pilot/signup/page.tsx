"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const inputClass =
  "rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  village: "",
  mandal: "",
  district: "",
};

export default function PilotSignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [licence, setLicence] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [licencePreview, setLicencePreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (url: string | null) => void
  ) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!licence || !photo) {
      setError("Please upload both your licence and a photo");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("licence", licence);
      body.append("photo", photo);

      const res = await fetch("/api/pilot/signup/register", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(`/auth/pilot/check-email?email=${encodeURIComponent(form.email)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16">
      <div className="w-full max-w-lg rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-900">{t("pilotSignup.title")}</h1>
        <p className="mb-6 text-sm text-emerald-700">{t("pilotSignup.step1")}</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("common.name")} span={2}>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
          </Field>
          <Field label={t("common.email")}>
            <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          </Field>
          <Field label={t("common.phone")}>
            <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="9876543210" />
          </Field>
          <Field label={t("common.village")}>
            <input required value={form.village} onChange={(e) => update("village", e.target.value)} className={inputClass} />
          </Field>
          <Field label={t("common.mandal")}>
            <input required value={form.mandal} onChange={(e) => update("mandal", e.target.value)} className={inputClass} />
          </Field>
          <Field label={t("common.district")} span={2}>
            <input required value={form.district} onChange={(e) => update("district", e.target.value)} className={inputClass} />
          </Field>

          <UploadBox
            label={t("pilotSignup.licence")}
            hint={t("pilotSignup.licenceHint")}
            addLabel={t("pilotSignup.addDocument")}
            tapLabel={t("pilotSignup.tapToChange")}
            preview={licencePreview}
            onChange={(e) => handleFile(e, setLicence, setLicencePreview)}
          />
          <UploadBox
            label={t("pilotSignup.photo")}
            hint={t("pilotSignup.photoHint")}
            addLabel={t("pilotSignup.addDocument")}
            tapLabel={t("pilotSignup.tapToChange")}
            preview={photoPreview}
            onChange={(e) => handleFile(e, setPhoto, setPhotoPreview)}
          />

          {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 mt-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? t("pilotSignup.uploading") : t("common.continue")}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link href="/auth/pilot/login" className="text-emerald-700 hover:underline">
            {t("pilotSignup.alreadyHaveAccount")}
          </Link>
          <Link href="/" className="text-stone-400 hover:text-stone-600">
            {t("common.backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium text-stone-700 ${span === 2 ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}

function UploadBox({
  label,
  hint,
  addLabel,
  tapLabel,
  preview,
  onChange,
}: {
  label: string;
  hint: string;
  addLabel: string;
  tapLabel: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <label
        className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
          preview
            ? "border-emerald-300 bg-emerald-50/50"
            : "border-emerald-300 bg-emerald-50 hover:border-emerald-500 hover:bg-emerald-100"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={onChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={`${label} preview`} className="h-32 w-full rounded-md object-cover" />
            <span className="mt-2 text-xs font-medium text-emerald-700">{tapLabel}</span>
          </>
        ) : (
          <>
            <span className="text-2xl">📄</span>
            <span className="mt-1 text-sm font-medium text-emerald-800">{addLabel}</span>
            <span className="mt-1 text-xs text-emerald-600">{hint}</span>
          </>
        )}
      </label>
    </div>
  );
}
