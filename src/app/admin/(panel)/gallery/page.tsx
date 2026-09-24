import { asc, count, desc } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import { Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { deleteGalleryImage, updateGalleryImage, uploadGalleryImages } from "@/app/actions/admin";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { Empty, PageTitle, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { cn, img, pageCount, parsePage } from "@/lib/utils";

const PAGE_SIZE = 24;

export const metadata = { title: "Gallery" };

export default async function GalleryAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const page = parsePage((await searchParams).page);
  const db = await getDb();
  const [rows, [{ n: total }], catRows] = await Promise.all([
    db
      .select()
      .from(schema.galleryImages)
      .orderBy(asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.galleryImages),
    db.selectDistinct({ c: schema.galleryImages.category }).from(schema.galleryImages),
  ]);
  const cats = Array.from(new Set(["Shop", "Repair", "Testing", "Power tools", "Fans", "Pumps", "Team", ...catRows.map((r) => r.c)]));

  return (
    <>
      <PageTitle title="Gallery" subtitle="Photos shown on the Gallery page and home page." />
      <Panel title="Upload images" className="mb-6">
        <ActionForm action={uploadGalleryImages} resetOnSuccess className="grid gap-4 md:grid-cols-[1fr_12rem_12rem_auto] md:items-end">
          <div>
            <label className="label">Images (multiple allowed)</label>
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-volt-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-950"
            />
            <input name="url" className="input mt-2 !py-2" placeholder="…or paste an image URL" />
          </div>
          <div>
            <label className="label">Title</label>
            <input name="title" className="input !py-2" placeholder="Optional" />
          </div>
          <div>
            <label className="label">Category</label>
            <input name="category" list="gal-cats" defaultValue="Shop" className="input !py-2" />
            <datalist id="gal-cats">
              {cats.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <SubmitButton pendingText="Uploading…">
            <Upload className="h-4 w-4" /> Upload
          </SubmitButton>
        </ActionForm>
      </Panel>

      {rows.length === 0 ? (
        <Empty>No images yet.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((g) => (
            <div key={g.id} className={cn("overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70", !g.isActive && "opacity-50")}>
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(g.url, 500)} alt={g.title} className="h-full w-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <form action={updateGalleryImage}>
                    <input type="hidden" name="id" value={g.id} />
                    <input type="hidden" name="isActive" value={String(!g.isActive)} />
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-ink-950/80 text-white backdrop-blur hover:bg-ink-950" title={g.isActive ? "Hide" : "Show"}>
                      {g.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </form>
                  <form action={deleteGalleryImage}>
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmButton message="Delete this image?" className="grid h-8 w-8 place-items-center rounded-full bg-ink-950/80 text-rose-400 backdrop-blur hover:bg-ink-950" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
              <form action={updateGalleryImage} className="space-y-2 p-3">
                <input type="hidden" name="id" value={g.id} />
                <input name="title" defaultValue={g.title} className="input !px-3 !py-1.5 !text-xs" placeholder="Title" />
                <div className="flex gap-2">
                  <input name="category" defaultValue={g.category} list="gal-cats" className="input !px-3 !py-1.5 !text-xs" />
                  <input name="sortOrder" type="number" defaultValue={g.sortOrder} className="input !w-20 !px-3 !py-1.5 !text-xs" title="Sort order" />
                </div>
                <button className="w-full rounded-lg bg-white/5 py-1.5 text-xs text-slate-300 hover:bg-white/10">Save</button>
              </form>
            </div>
          ))}
        </div>
      )}
      <Pagination className="mt-6" page={page} pageCount={pageCount(total, PAGE_SIZE)} total={total} href={(n) => `/admin/gallery?page=${n}`} />
    </>
  );
}
