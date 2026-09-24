import "server-only";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

/**
 * Stores an uploaded image and returns its public URL.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise writes to
 * /public/uploads (local development only — Vercel's filesystem is read-only).
 */
export async function saveImage(file: File, folder = "uploads"): Promise<string> {
  if (!file || file.size === 0) throw new Error("No file selected.");
  if (file.size > MAX_BYTES) throw new Error("Image is too large (max 4 MB).");
  if (!ALLOWED.includes(file.type)) throw new Error("Only JPG, PNG, WEBP, GIF, AVIF or SVG images are allowed.");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Image uploads need Vercel Blob. Connect a Blob store to this project (BLOB_READ_WRITE_TOKEN).");
  }

  const dest = path.join(process.cwd(), "public", name);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return `/${name}`;
}
