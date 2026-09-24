import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import { CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone, Trash2, X } from "lucide-react";
import { deleteBooking, updateBooking } from "@/app/actions/admin";
import { AutoSubmitSelect, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Badge, Empty, PageTitle, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { BOOKING_STATUSES, cn, formatDate, pageCount, parsePage, telHref, waHref } from "@/lib/utils";

const PAGE_SIZE = 20;

export const metadata = { title: "Bookings" };

type Props = { searchParams: Promise<{ status?: string; q?: string; id?: string; page?: string }> };

export default async function BookingsPage({ searchParams }: Props) {
  await requireAdmin();
  const { status = "all", q = "", id, page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const db = await getDb();

  const where: SQL[] = [];
  if (status !== "all") where.push(eq(schema.bookings.status, status));
  if (q) {
    const like = `%${q}%`;
    where.push(
      or(
        ilike(schema.bookings.name, like),
        ilike(schema.bookings.phone, like),
        ilike(schema.bookings.serviceName, like),
        ilike(schema.bookings.address, like),
      )!,
    );
  }
  const filter = where.length ? and(...where) : undefined;
  const [rows, [{ n: total }]] = await Promise.all([
    db
      .select()
      .from(schema.bookings)
      .where(filter)
      .orderBy(desc(schema.bookings.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.bookings).where(filter),
  ]);
  const selected = id ? (await db.select().from(schema.bookings).where(eq(schema.bookings.id, Number(id))))[0] : undefined;
  const statusOf = (v: string) => BOOKING_STATUSES.find((s) => s.value === v) ?? BOOKING_STATUSES[0];
  const qs = (p: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    const merged = { status, q, page: page > 1 ? String(page) : undefined, ...p };
    Object.entries(merged).forEach(([k, v]) => v && v !== "all" && u.set(k, v));
    return `/admin/bookings${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <PageTitle title="Bookings" subtitle="Service requests submitted from the website." />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[{ value: "all", label: "All" }, ...BOOKING_STATUSES].map((s) => (
            <Link
              key={s.value}
              href={qs({ status: s.value, id: undefined, page: undefined })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                status === s.value ? "bg-volt-500 text-ink-950" : "bg-white/5 text-slate-400 hover:text-white",
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, phone, service…" className="input !py-2 lg:w-72" />
          <button className="btn-ghost !py-2">Search</button>
        </form>
      </div>

      <div className={cn("grid gap-6", selected && "xl:grid-cols-[1fr_24rem]")}>
        <Panel className="overflow-hidden [&>div]:p-0">
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5 text-left text-xs tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Service</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Preferred</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((b) => (
                    <tr key={b.id} className={cn("transition hover:bg-white/[0.03]", selected?.id === b.id && "bg-volt-500/5")}>
                      <td className="px-5 py-3">
                        <Link href={qs({ id: String(b.id) })} className="block">
                          <span className="font-medium text-white">{b.name}</span>
                          <span className="block text-xs text-slate-500">
                            #{b.id} · {b.phone}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{b.serviceName}</td>
                      <td className="hidden px-5 py-3 text-xs text-slate-400 md:table-cell">
                        {b.preferredDate || "—"}
                        <br />
                        {b.preferredTime}
                      </td>
                      <td className="px-5 py-3">
                        <form action={updateBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <AutoSubmitSelect
                            name="status"
                            defaultValue={b.status}
                            className={cn("rounded-full border-0 px-2.5 py-1 text-xs font-medium ring-1 ring-inset outline-none", statusOf(b.status).color)}
                          >
                            {BOOKING_STATUSES.map((s) => (
                              <option key={s.value} value={s.value} className="bg-ink-900 text-white">
                                {s.label}
                              </option>
                            ))}
                          </AutoSubmitSelect>
                        </form>
                      </td>
                      <td className="hidden px-5 py-3 text-xs text-slate-500 lg:table-cell">{formatDate(b.createdAt, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className="border-t border-white/5 px-5 py-3"
                page={page}
                pageCount={pageCount(total, PAGE_SIZE)}
                total={total}
                href={(n) => qs({ page: n > 1 ? String(n) : undefined, id: undefined })}
              />
            </div>
          ) : (
            <div className="p-5">
              <Empty>No bookings found.</Empty>
            </div>
          )}
        </Panel>

        {selected && (
          <Panel
            title={`Booking #${selected.id}`}
            className="xl:sticky xl:top-6 xl:self-start"
            actions={
              <Link href={qs({ id: undefined })} className="text-slate-500 hover:text-white">
                <X className="h-4 w-4" />
              </Link>
            }
          >
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-display text-lg font-semibold text-white">{selected.name}</p>
                <Badge className={statusOf(selected.status).color}>{statusOf(selected.status).label}</Badge>
              </div>
              <ul className="space-y-2.5 text-slate-300">
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-volt-400" /> {selected.phone}
                </li>
                {selected.email && (
                  <li className="flex gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-volt-400" /> {selected.email}
                  </li>
                )}
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-volt-400" /> {selected.address}
                </li>
                <li className="flex gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-volt-400" /> {selected.preferredDate || "Any date"}
                </li>
                <li className="flex gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-volt-400" /> {selected.preferredTime || "Any time"}
                </li>
              </ul>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-slate-500 uppercase">Service</p>
                <p className="text-white">{selected.serviceName}</p>
                {selected.message && <p className="mt-2 whitespace-pre-wrap text-slate-300">{selected.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={telHref(selected.phone)} className="btn-primary !py-2">
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={waHref(selected.phone.replace(/^0/, "91"), `Hello ${selected.name}, this is regarding your booking #${selected.id} (${selected.serviceName}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost !py-2"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <form action={updateBooking} className="space-y-3 border-t border-white/5 pt-4">
                <input type="hidden" name="id" value={selected.id} />
                <div>
                  <label className="label">Status</label>
                  <select name="status" defaultValue={selected.status} className="input !py-2">
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Internal note</label>
                  <textarea name="adminNote" defaultValue={selected.adminNote} rows={3} className="input resize-none" placeholder="Visible to admins only" />
                </div>
                <SubmitButton className="w-full !py-2">Save</SubmitButton>
              </form>
              <form action={deleteBooking}>
                <input type="hidden" name="id" value={selected.id} />
                <ConfirmButton message="Delete this booking permanently?" className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete booking
                </ConfirmButton>
              </form>
              <p className="text-xs text-slate-500">
                Received {formatDate(selected.createdAt, true)} · Updated {formatDate(selected.updatedAt, true)}
              </p>
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
