import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb, schema } from "./db";
import { log } from "./logger";
import { mergeSettings, type SiteSettings } from "./settings-types";

/**
 * Public data layer.
 *  - `unstable_cache` = cross-request data cache (Vercel Data Cache in production),
 *    tagged so admin edits invalidate exactly what changed (see TAGS / revalidateTag).
 *  - React `cache` = de-dupes calls within one render.
 * Note: cached values are JSON-serialised, so Date columns arrive as ISO strings.
 */
export const TAGS = {
  settings: "settings",
  services: "services",
  gallery: "gallery",
  reviews: "reviews",
  faqs: "faqs",
  pages: "pages",
} as const;

const HOUR = 3600;

export const getSettings = cache(
  unstable_cache(
    async (): Promise<SiteSettings> => {
      try {
        const db = await getDb();
        const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 1));
        return mergeSettings(row?.data as Partial<SiteSettings> | undefined);
      } catch (e) {
        log.error("settings.load_failed", { error: e, hint: "Run `npm run db:setup`" });
        return mergeSettings(null);
      }
    },
    ["settings"],
    { tags: [TAGS.settings], revalidate: HOUR },
  ),
);

export const getActiveServices = cache(
  unstable_cache(
    async () => {
      const db = await getDb();
      return db
        .select()
        .from(schema.services)
        .where(eq(schema.services.isActive, true))
        .orderBy(asc(schema.services.sortOrder), asc(schema.services.id));
    },
    ["services:active"],
    { tags: [TAGS.services], revalidate: HOUR },
  ),
);

export const getServiceBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const db = await getDb();
      const [row] = await db
        .select()
        .from(schema.services)
        .where(and(eq(schema.services.slug, slug), eq(schema.services.isActive, true)));
      return row ?? null;
    },
    ["services:slug"],
    { tags: [TAGS.services], revalidate: HOUR },
  ),
);

export const getGallery = cache(
  unstable_cache(
    async () => {
      const db = await getDb();
      return db
        .select()
        .from(schema.galleryImages)
        .where(eq(schema.galleryImages.isActive, true))
        .orderBy(asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.id));
    },
    ["gallery"],
    { tags: [TAGS.gallery], revalidate: HOUR },
  ),
);

export const REVIEWS_PAGE_SIZE = 9;

/** Paginated visible reviews. */
export const getVisibleReviews = cache(
  unstable_cache(
    async (page = 1, pageSize = REVIEWS_PAGE_SIZE) => {
      const db = await getDb();
      const where = eq(schema.reviews.isVisible, true);
      const [rows, [{ n }]] = await Promise.all([
        db
          .select()
          .from(schema.reviews)
          .where(where)
          .orderBy(desc(schema.reviews.publishedAt), desc(schema.reviews.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ n: count() }).from(schema.reviews).where(where),
      ]);
      return { rows, total: n, page, pageCount: Math.max(1, Math.ceil(n / pageSize)) };
    },
    ["reviews:visible"],
    { tags: [TAGS.reviews], revalidate: HOUR },
  ),
);

export const getFaqs = cache(
  unstable_cache(
    async () => {
      const db = await getDb();
      return db
        .select()
        .from(schema.faqs)
        .where(eq(schema.faqs.isActive, true))
        .orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));
    },
    ["faqs"],
    { tags: [TAGS.faqs], revalidate: HOUR },
  ),
);

export const getPage = cache(
  unstable_cache(
    async (slug: string) => {
      const db = await getDb();
      const [row] = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug));
      return row ?? null;
    },
    ["page"],
    { tags: [TAGS.pages], revalidate: HOUR },
  ),
);
