import { mkdir, writeFile, readFile, stat } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Local-disk storage for dev, kept behind this interface so swapping to
// Cloudflare R2 later (production) only means rewriting this file — nothing
// that calls saveUploadedFile/readStoredFile/deleteStoredFile changes.
// Files live outside `public/`, so nothing here is served by static hosting;
// they're only reachable through the authorized /api/files/[...key] route.

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

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

  return writeToDisk(file, folder, ext);
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

  return writeToDisk(file, "proofs", ext);
}

async function writeToDisk(file: File, folder: string, ext: string): Promise<string> {
  const key = `${folder}/${randomUUID()}.${ext}`;
  const fullPath = path.join(UPLOAD_ROOT, key);

  await mkdir(path.dirname(fullPath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return key;
}

// Prevents path traversal: only allows the exact folder/uuid.ext shape this
// module generates, and resolves must stay inside UPLOAD_ROOT.
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

  const fullPath = path.join(UPLOAD_ROOT, key);
  if (!fullPath.startsWith(UPLOAD_ROOT)) return null;

  try {
    await stat(fullPath);
  } catch {
    return null;
  }

  const buffer = await readFile(fullPath);
  const ext = path.extname(key).slice(1);
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return { buffer, contentType };
}
