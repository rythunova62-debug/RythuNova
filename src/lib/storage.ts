import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Supabase Storage (private bucket) — kept behind this interface so nothing
// that calls saveUploadedFile/saveUploadedVideo/readStoredFile needs to
// change if storage is swapped again later (e.g. to R2). Files are only
// reachable through the authorized /api/files/[...key] route — the bucket
// itself is private, not served directly.

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!;

const IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const VIDEO_MIME_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
// No server-side duration check (would need ffprobe, not installed). A ~7-8s
// clip at typical phone compression fits well under this; the client also
// checks duration before upload as a data-quality nudge, not a security control.
const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // 20MB

export class UploadValidationError extends Error {}

export async function saveUploadedFile(
  file: File,
  folder: "licences" | "photos"
): Promise<string> {
  const ext = IMAGE_MIME_TYPES[file.type];
  if (!ext) {
    throw new UploadValidationError("Only JPG, PNG, or WEBP images are allowed");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError("File must be 5MB or smaller");
  }
  if (file.size === 0) {
    throw new UploadValidationError("File is empty");
  }

  return uploadToSupabase(file, folder, ext);
}

export async function saveUploadedVideo(file: File): Promise<string> {
  const ext = VIDEO_MIME_TYPES[file.type];
  if (!ext) {
    throw new UploadValidationError("Only MP4, WEBM, or MOV videos are allowed");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new UploadValidationError("Video must be 20MB or smaller");
  }
  if (file.size === 0) {
    throw new UploadValidationError("File is empty");
  }

  return uploadToSupabase(file, "proofs", ext);
}

async function uploadToSupabase(file: File, folder: string, ext: string): Promise<string> {
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return key;
}

// Prevents path traversal / arbitrary key access: only allows the exact
// folder/uuid.ext shape this module generates.
const SAFE_KEY = /^(licences|photos|proofs)\/[a-f0-9-]{36}\.(jpg|png|webp|mp4|webm|mov)$/;

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export async function readStoredFile(key: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!SAFE_KEY.test(key)) return null;

  const { data, error } = await supabase.storage.from(BUCKET).download(key);
  if (error || !data) return null;

  const buffer = Buffer.from(await data.arrayBuffer());
  const ext = key.split(".").pop() ?? "";
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return { buffer, contentType };
}
