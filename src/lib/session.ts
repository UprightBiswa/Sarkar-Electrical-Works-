import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sew_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; role: string; name: string; email: string };

let cachedKey: Uint8Array | undefined;

/**
 * Signing key. Uses SESSION_SECRET when set; otherwise derives a stable secret
 * from DATABASE_URL (already a private value), so no extra env var is required.
 */
async function secretKey() {
  if (cachedKey) return cachedKey;
  const explicit = process.env.SESSION_SECRET;
  if (explicit) return (cachedKey = new TextEncoder().encode(explicit));
  const base = process.env.DATABASE_URL || "local-dev-only-secret";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`sew-session:${base}`));
  return (cachedKey = new Uint8Array(digest));
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ role: payload.role, name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(await secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await secretKey(), { algorithms: ["HS256"] });
    return {
      sub: String(payload.sub),
      role: String(payload.role ?? "staff"),
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}
