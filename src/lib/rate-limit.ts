import "server-only";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { log } from "./logger";

export type RateLimitRule = { limit: number; windowSec: number };

export const RULES = {
  booking: { limit: 5, windowSec: 60 * 60 }, // 5 bookings / hour / IP
  contact: { limit: 5, windowSec: 60 * 60 }, // 5 messages / hour / IP
  login: { limit: 8, windowSec: 15 * 60 }, // 8 attempts / 15 min / IP+email
  track: { limit: 120, windowSec: 60 }, // 120 page views / minute / IP
} satisfies Record<string, RateLimitRule>;

export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Fixed-window counter stored in Postgres (works across serverless instances,
 * no extra infrastructure). One atomic upsert per check.
 * Fails open: if the database is unavailable, requests are allowed.
 */
export async function rateLimit(bucket: keyof typeof RULES, identifier: string) {
  const { limit, windowSec } = RULES[bucket];
  const key = `${bucket}:${identifier}`.slice(0, 200);
  try {
    const db = await getDb();
    const res = await db.execute(sql`
      insert into rate_limits (key, count, window_start)
      values (${key}, 1, now())
      on conflict (key) do update set
        count = case when rate_limits.window_start < now() - make_interval(secs => ${windowSec})
                     then 1 else rate_limits.count + 1 end,
        window_start = case when rate_limits.window_start < now() - make_interval(secs => ${windowSec})
                     then now() else rate_limits.window_start end
      returning count, extract(epoch from (window_start + make_interval(secs => ${windowSec}) - now()))::int as reset_in
    `);
    const row = (Array.isArray(res) ? res[0] : (res as { rows: Record<string, unknown>[] }).rows[0]) as {
      count: number;
      reset_in: number;
    };
    const count = Number(row.count);
    const ok = count <= limit;
    if (!ok) log.warn("ratelimit.blocked", { bucket, key: key.replace(/:.*$/, ":***"), count, limit });
    return { ok, remaining: Math.max(0, limit - count), resetIn: Number(row.reset_in) };
  } catch (e) {
    log.error("ratelimit.failed", { bucket, error: e });
    return { ok: true, remaining: limit, resetIn: 0 };
  }
}

export function retryText(sec: number) {
  if (sec < 90) return `${Math.max(1, sec)} seconds`;
  return `${Math.ceil(sec / 60)} minutes`;
}
