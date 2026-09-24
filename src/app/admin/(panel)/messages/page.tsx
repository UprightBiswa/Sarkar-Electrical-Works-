import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import { Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { deleteMessage, replyToMessage, setMessageRead } from "@/app/actions/admin";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Empty, PageTitle, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { emailEnabled } from "@/lib/email";
import { cn, formatDate, pageCount, parsePage, telHref } from "@/lib/utils";

const PAGE_SIZE = 20;

export const metadata = { title: "Messages" };

type Props = { searchParams: Promise<{ id?: string; filter?: string; page?: string }> };

export default async function MessagesPage({ searchParams }: Props) {
  await requireAdmin();
  const { id, filter, page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const db = await getDb();
  const where = filter === "unread" ? eq(schema.contactMessages.isRead, false) : undefined;
  const [rows, [{ n: total }]] = await Promise.all([
    db
      .select()
      .from(schema.contactMessages)
      .where(where)
      .orderBy(desc(schema.contactMessages.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.contactMessages).where(where),
  ]);
  const link = (p: { id?: number; page?: number }) => {
    const u = new URLSearchParams();
    if (filter) u.set("filter", filter);
    const pg = p.page ?? page;
    if (pg > 1) u.set("page", String(pg));
    if (p.id) u.set("id", String(p.id));
    return `/admin/messages${u.size ? `?${u}` : ""}`;
  };
  const selectedId = Number(id ?? rows[0]?.id ?? 0);
  let selected = rows.find((r) => r.id === selectedId);
  if (id && !selected) [selected] = await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.id, selectedId));

  // Opening a message marks it read
  if (selected && !selected.isRead && id) {
    await db.update(schema.contactMessages).set({ isRead: true }).where(eq(schema.contactMessages.id, selected.id));
    selected = { ...selected, isRead: true };
  }

  return (
    <>
      <PageTitle title="Messages" subtitle="Enquiries from the Contact Us form.">
        {[
          { v: undefined, l: "All" },
          { v: "unread", l: "Unread" },
        ].map((f) => (
          <Link
            key={f.l}
            href={f.v ? `/admin/messages?filter=${f.v}` : "/admin/messages"}
            className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium", filter === f.v ? "bg-volt-500 text-ink-950" : "bg-white/5 text-slate-400")}
          >
            {f.l}
          </Link>
        ))}
      </PageTitle>

      {rows.length === 0 && !selected ? (
        <Empty>No messages yet. They will appear here when customers use the Contact page.</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <Panel className="[&>div]:p-2">
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
              {rows.map((m) => (
                <li key={m.id}>
                  <Link
                    href={link({ id: m.id })}
                    className={cn("block rounded-xl p-3 transition", selected?.id === m.id ? "bg-volt-500/10 ring-1 ring-volt-500/30" : "hover:bg-white/5")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", m.isRead ? "text-slate-300" : "font-semibold text-white")}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-slate-500">{formatDate(m.createdAt)}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      {!m.isRead && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-volt-400 align-middle" />}
                      {m.subject || m.message}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination className="mt-2 px-2 pb-1" page={page} pageCount={pageCount(total, PAGE_SIZE)} href={(n) => link({ page: n })} />
          </Panel>

          {selected && (
            <Panel>
              <div className="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">{selected.subject || "Website enquiry"}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {selected.name} · <a href={`mailto:${selected.email}`} className="text-volt-400 hover:underline">{selected.email}</a>
                    {selected.phone && (
                      <>
                        {" "}
                        · <a href={telHref(selected.phone)} className="hover:underline">{selected.phone}</a>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(selected.createdAt, true)}</p>
                </div>
                <div className="flex gap-2">
                  <form action={setMessageRead}>
                    <input type="hidden" name="id" value={selected.id} />
                    <input type="hidden" name="isRead" value={String(!selected.isRead)} />
                    <button className="btn-ghost !px-3 !py-2 text-xs" title={selected.isRead ? "Mark unread" : "Mark read"}>
                      {selected.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                      {selected.isRead ? "Mark unread" : "Mark read"}
                    </button>
                  </form>
                  {selected.phone && (
                    <a href={telHref(selected.phone)} className="btn-ghost !px-3 !py-2 text-xs">
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={selected.id} />
                    <ConfirmButton message="Delete this message?" className="btn !px-3 !py-2 text-rose-400 hover:bg-rose-500/10" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>

              <p className="py-6 text-[15px] leading-7 whitespace-pre-wrap text-slate-200">{selected.message}</p>

              {selected.reply && (
                <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs font-medium text-emerald-300">Your reply · {formatDate(selected.repliedAt, true)}</p>
                  <p className="mt-2 text-sm whitespace-pre-wrap text-slate-300">{selected.reply}</p>
                </div>
              )}

              <ActionForm action={replyToMessage} className="space-y-3 border-t border-white/5 pt-5" resetOnSuccess>
                <input type="hidden" name="id" value={selected.id} />
                <label className="label">Reply to {selected.name}</label>
                <textarea name="reply" rows={5} className="input resize-none" placeholder="Write your reply…" />
                <div className="flex flex-wrap items-center gap-3">
                  <SubmitButton pendingText="Sending…">{emailEnabled() ? "Send reply by email" : "Save reply"}</SubmitButton>
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "Your enquiry"}`)}`}
                    className="btn-ghost"
                  >
                    <Mail className="h-4 w-4" /> Open in mail app
                  </a>
                </div>
                {!emailEnabled() && (
                  <p className="text-xs text-slate-500">Tip: add RESEND_API_KEY to send replies directly from here.</p>
                )}
              </ActionForm>
            </Panel>
          )}
        </div>
      )}
    </>
  );
}
