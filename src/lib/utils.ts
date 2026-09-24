import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function waHref(number: string, text = "") {
  const n = number.replace(/\D/g, "");
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Adds sizing params to Unsplash URLs; leaves other URLs untouched. */
export function img(url: string, w = 1200) {
  if (!url) return url;
  if (url.includes("images.unsplash.com")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${w}&q=80&auto=format&fit=crop`;
  }
  return url;
}

export function formatDate(d: Date | string | null | undefined, withTime = false) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  });
}

export const BOOKING_STATUSES = [
  { value: "new", label: "New", color: "bg-sky-500/15 text-sky-300 ring-sky-500/30" },
  { value: "confirmed", label: "Confirmed", color: "bg-violet-500/15 text-violet-300 ring-violet-500/30" },
  { value: "in_progress", label: "In progress", color: "bg-amber-500/15 text-amber-300 ring-amber-500/30" },
  { value: "completed", label: "Completed", color: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30" },
  { value: "cancelled", label: "Cancelled", color: "bg-rose-500/15 text-rose-300 ring-rose-500/30" },
] as const;
