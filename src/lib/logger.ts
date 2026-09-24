/**
 * Tiny structured logger. Emits one JSON line per event so logs are searchable
 * in Vercel → Logs (filter by `"event":"booking.created"` etc.).
 */
type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, event: string, data?: Record<string, unknown>) {
  if (level === "debug" && process.env.NODE_ENV === "production") return;
  const line = JSON.stringify({
    t: new Date().toISOString(),
    level,
    event,
    ...data,
    ...(data?.error instanceof Error ? { error: data.error.message, stack: data.error.stack?.split("\n").slice(0, 4).join(" | ") } : {}),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  debug: (event: string, data?: Record<string, unknown>) => emit("debug", event, data),
  info: (event: string, data?: Record<string, unknown>) => emit("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => emit("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => emit("error", event, data),
};

/** Masks personal data before logging (keeps logs useful but privacy-friendly). */
export function mask(value: string, keep = 3) {
  if (!value) return "";
  return value.length <= keep ? "*".repeat(value.length) : value.slice(0, keep) + "*".repeat(Math.min(6, value.length - keep));
}
