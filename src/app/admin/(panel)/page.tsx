import Link from "next/link";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { ArrowUpRight, BarChart3, CalendarCheck, Eye, Inbox, Wrench } from "lucide-react";
import BarChart from "@/components/admin/BarChart";
import { Badge, Empty, PageTitle, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { BOOKING_STATUSES, formatDate } from "@/lib/utils";

const DAYS = 14;

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000);
}

function lastDays(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    out.push(d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })); // YYYY-MM-DD
  }
  return out;
}

export default async function Dashboard() {
  const admin = await requireAdmin();
  const db = await getDb();
  const since = daysAgo(DAYS);
  const since30 = daysAgo(30);
  const dayExpr = (col: typeof schema.bookings.createdAt | typeof schema.pageViews.createdAt) =>
    sql<string>`to_char(${col} at time zone 'Asia/Kolkata', 'YYYY-MM-DD')`;

  const [
    [totalBookings],
    [newBookings],
    [unread],
    [activeServices],
    [visits30],
    bookingsByDay,
    visitsByDay,
    recentBookings,
    recentMessages,
    topPages,
    devices,
  ] = await Promise.all([
    db.select({ n: count() }).from(schema.bookings),
    db.select({ n: count() }).from(schema.bookings).where(eq(schema.bookings.status, "new")),
    db.select({ n: count() }).from(schema.contactMessages).where(eq(schema.contactMessages.isRead, false)),
    db.select({ n: count() }).from(schema.services).where(eq(schema.services.isActive, true)),
    db.select({ n: count() }).from(schema.pageViews).where(gte(schema.pageViews.createdAt, since30)),
    db
      .select({ day: dayExpr(schema.bookings.createdAt), n: count() })
      .from(schema.bookings)
      .where(gte(schema.bookings.createdAt, since))
      .groupBy(dayExpr(schema.bookings.createdAt)),
    db
      .select({ day: dayExpr(schema.pageViews.createdAt), n: count() })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, since))
      .groupBy(dayExpr(schema.pageViews.createdAt)),
    db.select().from(schema.bookings).orderBy(desc(schema.bookings.createdAt)).limit(6),
    db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).limit(5),
    db
      .select({ path: schema.pageViews.path, n: count() })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, since30))
      .groupBy(schema.pageViews.path)
      .orderBy(desc(count()))
      .limit(6),
    db
      .select({ device: schema.pageViews.device, n: count() })
      .from(schema.pageViews)
      .where(gte(schema.pageViews.createdAt, since30))
      .groupBy(schema.pageViews.device),
  ]);

  const days = lastDays(DAYS);
  const toSeries = (rows: { day: string; n: number }[]) =>
    days.map((d) => ({
      label: new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      value: Number(rows.find((r) => r.day === d)?.n ?? 0),
    }));

  const stats = [
    { label: "New bookings", value: newBookings.n, icon: CalendarCheck, href: "/admin/bookings?status=new", hint: `${totalBookings.n} total` },
    { label: "Unread messages", value: unread.n, icon: Inbox, href: "/admin/messages", hint: "Contact form" },
    { label: "Visits (30 days)", value: visits30.n, icon: Eye, href: "#traffic", hint: "Website page views" },
    { label: "Active services", value: activeServices.n, icon: Wrench, href: "/admin/services", hint: "Shown on website" },
  ];
  const totalDevices = devices.reduce((a, d) => a + d.n, 0) || 1;
  const statusOf = (v: string) => BOOKING_STATUSES.find((s) => s.value === v) ?? BOOKING_STATUSES[0];

  return (
    <>
      <PageTitle title={`Hello, ${admin.name.split(" ")[0]} 👋`} subtitle="Here's what's happening with your business." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl border border-white/10 bg-ink-900/70 p-5 transition hover:border-volt-500/40">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-500/10 text-volt-400">
                <s.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-volt-400" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-slate-300">{s.label}</p>
            <p className="text-xs text-slate-500">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title={`Bookings · last ${DAYS} days`}>
          <BarChart data={toSeries(bookingsByDay)} unit="bookings" />
        </Panel>
        <Panel title={`Website visits · last ${DAYS} days`} className="scroll-mt-6" actions={<span id="traffic" />}>
          <BarChart data={toSeries(visitsByDay)} unit="page views" color="var(--color-spark-400)" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Recent bookings"
          actions={
            <Link href="/admin/bookings" className="text-xs text-volt-400 hover:underline">
              View all
            </Link>
          }
        >
          {recentBookings.length ? (
            <ul className="divide-y divide-white/5">
              {recentBookings.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings?id=${b.id}`} className="flex items-center justify-between gap-4 py-3 hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        #{b.id} · {b.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {b.serviceName} · {formatDate(b.createdAt, true)}
                      </p>
                    </div>
                    <Badge className={statusOf(b.status).color}>{statusOf(b.status).label}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No bookings yet.</Empty>
          )}
        </Panel>

        <Panel
          title="Latest messages"
          actions={
            <Link href="/admin/messages" className="text-xs text-volt-400 hover:underline">
              View all
            </Link>
          }
        >
          {recentMessages.length ? (
            <ul className="divide-y divide-white/5">
              {recentMessages.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages?id=${m.id}`} className="flex gap-3 py-3 hover:opacity-80">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.isRead ? "bg-transparent" : "bg-volt-400"}`} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{m.name}</p>
                      <p className="truncate text-xs text-slate-500">{m.subject || m.message}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No messages yet.</Empty>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Top pages · 30 days" className="xl:col-span-1">
          {topPages.length ? (
            <ul className="space-y-3">
              {topPages.map((p) => (
                <li key={p.path} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate text-slate-300">{p.path}</span>
                    <span className="text-slate-400">{p.n}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-spark-400" style={{ width: `${(p.n / topPages[0].n) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No visits recorded yet.</Empty>
          )}
        </Panel>
        <Panel title="Devices · 30 days">
          {devices.length ? (
            <ul className="space-y-3 text-sm">
              {devices.map((d) => (
                <li key={d.device} className="flex items-center justify-between">
                  <span className="text-slate-300 capitalize">{d.device || "unknown"}</span>
                  <span className="text-slate-400">
                    {d.n} · {Math.round((d.n / totalDevices) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No data yet.</Empty>
          )}
        </Panel>
        <Panel title="Vercel Analytics">
          <div className="flex flex-col items-start gap-3">
            <BarChart3 className="h-8 w-8 text-volt-400" />
            <p className="text-sm text-slate-400">
              Vercel Web Analytics & Speed Insights are installed on every public page. See visitors, referrers, countries and Core Web Vitals in your Vercel dashboard.
            </p>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 text-xs">
              Open Vercel dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Panel>
      </div>
    </>
  );
}
