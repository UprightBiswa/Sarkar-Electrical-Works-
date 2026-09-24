import { count, desc } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { deleteReview, saveReview, syncGoogleReviews, toggleReview } from "@/app/actions/admin";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Badge, Empty, PageTitle, Panel } from "@/components/admin/ui";
import { Stars } from "@/components/site/ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { getDb, schema } from "@/lib/db";
import { cn, formatDate, pageCount, parsePage } from "@/lib/utils";

const PAGE_SIZE = 12;

export const metadata = { title: "Reviews" };

export default async function ReviewsAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const page = parsePage((await searchParams).page);
  const db = await getDb();
  const [rows, [{ n: total }], s] = await Promise.all([
    db
      .select()
      .from(schema.reviews)
      .orderBy(desc(schema.reviews.publishedAt), desc(schema.reviews.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.reviews),
    getSettings(),
  ]);
  const hasKey = Boolean(process.env.GOOGLE_PLACES_API_KEY);

  return (
    <>
      <PageTitle title="Reviews" subtitle="Google reviews and customer testimonials shown on the website." />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Google reviews">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-white">{s.google.rating ? s.google.rating.toFixed(1) : "—"}</span>
              <div>
                <Stars rating={s.google.rating || 0} />
                <p className="text-xs text-slate-400">{s.google.reviewCount} reviews on Google</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Last synced: {s.google.lastSyncedAt ? formatDate(s.google.lastSyncedAt, true) : "never"}
              {s.google.placeId && <> · Place ID: {s.google.placeId}</>}
            </p>
            {hasKey ? (
              <ActionForm action={syncGoogleReviews}>
                <SubmitButton pendingText="Syncing…">
                  <RefreshCw className="h-4 w-4" /> Sync from Google now
                </SubmitButton>
              </ActionForm>
            ) : (
              <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                Add <code>GOOGLE_PLACES_API_KEY</code> (Places API — New) to your environment variables to import reviews and your star rating
                automatically. Google returns up to 5 most relevant reviews per sync; synced reviews are kept.
              </p>
            )}
          </div>
        </Panel>

        <Panel title="Add a testimonial">
          <ActionForm action={saveReview} resetOnSuccess className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
              <input name="authorName" className="input !py-2" placeholder="Customer name" required />
              <select name="rating" defaultValue="5" className="input !py-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>
            <textarea name="text" rows={3} className="input resize-none" placeholder="What did the customer say?" required />
            <input name="relativeTime" className="input !py-2" placeholder='When (optional), e.g. "2 weeks ago"' />
            <SubmitButton>Add review</SubmitButton>
          </ActionForm>
        </Panel>
      </div>

      {rows.length === 0 ? (
        <Empty>No reviews yet. Sync from Google or add a testimonial above.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className={cn("flex flex-col rounded-2xl border border-white/10 bg-ink-900/70 p-5", !r.isVisible && "opacity-50")}>
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                <Badge className={r.source === "google" ? "bg-sky-500/15 text-sky-300 ring-sky-500/30" : "bg-violet-500/15 text-violet-300 ring-violet-500/30"}>
                  {r.source}
                </Badge>
              </div>
              <p className="mt-3 line-clamp-5 flex-1 text-sm text-slate-300">{r.text}</p>
              <p className="mt-3 text-sm font-medium text-white">{r.authorName}</p>
              <p className="text-xs text-slate-500">{r.relativeTime || formatDate(r.publishedAt)}</p>
              <div className="mt-4 flex gap-2">
                <form action={toggleReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="isVisible" value={String(!r.isVisible)} />
                  <button className="btn-ghost !px-3 !py-1.5 text-xs">
                    {r.isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {r.isVisible ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <ConfirmButton message="Delete this review?" className="btn !px-3 !py-1.5 text-xs text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination className="mt-6" page={page} pageCount={pageCount(total, PAGE_SIZE)} total={total} href={(n) => `/admin/reviews?page=${n}`} />
    </>
  );
}
