import { count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/client";
import { logout } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const db = await getDb();
  const [[b], [m]] = await Promise.all([
    db.select({ n: count() }).from(schema.bookings).where(eq(schema.bookings.status, "new")),
    db.select({ n: count() }).from(schema.contactMessages).where(eq(schema.contactMessages.isRead, false)),
  ]);
  return (
    <AdminShell admin={admin} counts={{ bookings: b?.n ?? 0, messages: m?.n ?? 0 }} logoutAction={logout}>
      {children}
    </AdminShell>
  );
}
