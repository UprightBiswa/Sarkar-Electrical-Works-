import { asc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { changePassword, createAdmin, deleteAdmin } from "@/app/actions/admin";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Badge, PageTitle, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin users" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const db = await getDb();
  const admins = await db
    .select({
      id: schema.admins.id,
      name: schema.admins.name,
      email: schema.admins.email,
      role: schema.admins.role,
      lastLoginAt: schema.admins.lastLoginAt,
      createdAt: schema.admins.createdAt,
    })
    .from(schema.admins)
    .orderBy(asc(schema.admins.id));
  const isOwner = me.role === "owner";

  return (
    <>
      <PageTitle title="Admin users" subtitle="People who can sign in to this admin panel." />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Team" className="[&>div]:p-0">
          <ul className="divide-y divide-white/5">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-volt-500 to-spark-500 font-bold text-ink-950">
                  {a.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {a.name} {a.id === me.id && <span className="text-xs font-normal text-slate-500">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-slate-400">{a.email}</p>
                  <p className="text-[11px] text-slate-500">Last login: {formatDate(a.lastLoginAt, true)}</p>
                </div>
                <Badge className={a.role === "owner" ? "bg-volt-500/15 text-volt-300 ring-volt-500/30" : "bg-slate-500/15 text-slate-300 ring-slate-500/30"}>
                  {a.role}
                </Badge>
                {isOwner && a.id !== me.id && (
                  <form action={deleteAdmin}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmButton message={`Remove ${a.email}?`} className="grid h-8 w-8 place-items-center rounded-full text-rose-400 hover:bg-rose-500/10" title="Remove">
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          {isOwner && (
            <Panel title="Add admin">
              <ActionForm action={createAdmin} resetOnSuccess className="space-y-3">
                <input name="name" className="input !py-2" placeholder="Name" required />
                <input name="email" type="email" className="input !py-2" placeholder="Email" required />
                <input name="password" type="password" className="input !py-2" placeholder="Temporary password (min 8)" required minLength={8} />
                <select name="role" className="input !py-2" defaultValue="staff">
                  <option value="staff">Staff — manage content & bookings</option>
                  <option value="owner">Owner — also manages admins</option>
                </select>
                <SubmitButton>Create admin</SubmitButton>
              </ActionForm>
            </Panel>
          )}
          <Panel title="Change your password">
            <ActionForm action={changePassword} resetOnSuccess className="space-y-3">
              <input name="current" type="password" className="input !py-2" placeholder="Current password" autoComplete="current-password" />
              <input name="next" type="password" className="input !py-2" placeholder="New password (min 8)" autoComplete="new-password" />
              <input name="confirm" type="password" className="input !py-2" placeholder="Confirm new password" autoComplete="new-password" />
              <SubmitButton>Update password</SubmitButton>
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
