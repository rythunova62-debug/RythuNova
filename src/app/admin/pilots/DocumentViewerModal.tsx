"use client";

import { useState } from "react";

export default function DocumentViewerModal({
  name,
  licenceFileKey,
  photoFileKey,
  onClose,
}: {
  name: string;
  licenceFileKey: string | null;
  photoFileKey: string | null;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState<"licence" | "photo" | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">{name} — Documents</h2>
          <button onClick={onClose} className="text-sm text-stone-500 hover:text-stone-800">
            Close ✕
          </button>
        </div>

        {zoomed ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setZoomed(null)}
              className="w-fit text-sm text-emerald-700 hover:underline"
            >
              ← Back to both
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${zoomed === "licence" ? licenceFileKey : photoFileKey}`}
              alt={zoomed === "licence" ? "Licence — zoomed" : "Pilot photo — zoomed"}
              className="max-h-[75vh] w-full rounded-md border border-stone-200 object-contain"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DocCard
              label="Drone Driving Licence"
              fileKey={licenceFileKey}
              onZoom={() => setZoomed("licence")}
            />
            <DocCard
              label="Pilot Photo"
              fileKey={photoFileKey}
              onZoom={() => setZoomed("photo")}
            />
          </div>
        )}

        <p className="mt-4 text-xs text-stone-400">
          Compare the licence document against the pilot&apos;s photo to confirm identity, then
          verify manually against government records before approving.
        </p>
      </div>
    </div>
  );
}

function DocCard({
  label,
  fileKey,
  onZoom,
}: {
  label: string;
  fileKey: string | null;
  onZoom: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {fileKey ? (
        <button onClick={onZoom} className="group relative overflow-hidden rounded-md border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/files/${fileKey}`}
            alt={label}
            className="h-64 w-full object-cover transition group-hover:opacity-80"
          />
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
            Click to zoom
          </span>
        </button>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-stone-300 text-sm text-stone-400">
          Not uploaded
        </div>
      )}
    </div>
  );
}
