import Link from "next/link";
import { asc } from "drizzle-orm";
import { ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { deleteService, toggleService } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/client";
import { Badge, Empty, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { Icon } from "@/lib/icons";
import { cn, img } from "@/lib/utils";

export const metadata = { title: "Services" };

export default async function ServicesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const db = await getDb();
  const rows = await db.select().from(schema.services).orderBy(asc(schema.services.sortOrder), asc(schema.services.id));

  return (
    <>
      <PageTitle title="Services" subtitle="Add, edit and reorder the services shown on your website.">
        <Link href="/admin/services/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New service
        </Link>
      </PageTitle>
      {saved && <p className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Service saved.</p>}
      {rows.length === 0 ? (
        <Empty>No services yet.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((s) => (
            <div key={s.id} className={cn("overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70", !s.isActive && "opacity-60")}>
              <div className="relative h-36">
                {s.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(s.image, 600)} alt="" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
                <span className="absolute bottom-3 left-4 grid h-10 w-10 place-items-center rounded-xl bg-volt-500 text-ink-950">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {s.isFeatured && <Badge className="bg-volt-500/20 text-volt-300 ring-volt-500/30">Featured</Badge>}
                  {!s.isActive && <Badge className="bg-slate-500/20 text-slate-300 ring-slate-500/30">Hidden</Badge>}
                </div>
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-white">{s.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">{s.shortDesc}</p>
                <p className="mt-2 text-xs text-slate-500">
                  /{s.slug} · {s.priceFrom || "no price"} · order {s.sortOrder}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Link href={`/admin/services/${s.id}`} className="btn-ghost !px-3 !py-1.5 text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="field" value="isActive" />
                    <input type="hidden" name="value" value={String(!s.isActive)} />
                    <button className="btn-ghost !px-3 !py-1.5 text-xs">{s.isActive ? "Hide" : "Show"}</button>
                  </form>
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="field" value="isFeatured" />
                    <input type="hidden" name="value" value={String(!s.isFeatured)} />
                    <button className="btn-ghost !px-3 !py-1.5 text-xs" title="Toggle featured">
                      <Star className={cn("h-3.5 w-3.5", s.isFeatured && "fill-volt-400 text-volt-400")} />
                    </button>
                  </form>
                  <a href={`/services/${s.slug}`} target="_blank" className="btn-ghost !px-3 !py-1.5 text-xs" title="View">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <form action={deleteService} className="ml-auto">
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton message={`Delete "${s.title}"?`} className="grid h-8 w-8 place-items-center rounded-full text-rose-400 hover:bg-rose-500/10" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
