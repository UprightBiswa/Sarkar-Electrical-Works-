import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./session";

export async function createSession(admin: { id: number; role: string; name: string; email: string }) {
  const token = await signSession({
    sub: String(admin.id),
    role: admin.role,
    name: admin.name,
    email: admin.email,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Returns the logged-in admin (verified against the database), or null. */
export async function getCurrentAdmin() {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const db = await getDb();
  const [admin] = await db
    .select({
      id: schema.admins.id,
      name: schema.admins.name,
      email: schema.admins.email,
      role: schema.admins.role,
    })
    .from(schema.admins)
    .where(eq(schema.admins.id, Number(session.sub)))
    .limit(1);
  return admin ?? null;
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireOwner() {
  const admin = await requireAdmin();
  if (admin.role !== "owner") throw new Error("Only the owner can do this.");
  return admin;
}
