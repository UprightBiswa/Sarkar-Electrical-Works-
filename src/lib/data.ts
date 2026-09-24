import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb, schema } from "./db";
import { mergeSettings, type SiteSettings } from "./settings-types";

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const db = await getDb();
    const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 1));
    return mergeSettings(row?.data as Partial<SiteSettings> | undefined);
  } catch (e) {
    console.error("getSettings failed — is the database set up? Run `npm run db:setup`.", e);
    return mergeSettings(null);
  }
});

export const getActiveServices = cache(async () => {
  const db = await getDb();
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.isActive, true))
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.id));
});

export const getServiceBySlug = cache(async (slug: string) => {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(schema.services)
    .where(and(eq(schema.services.slug, slug), eq(schema.services.isActive, true)));
  return row ?? null;
});

export const getGallery = cache(async () => {
  const db = await getDb();
  return db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.isActive, true))
    .orderBy(asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.id));
});

export const getVisibleReviews = cache(async () => {
  const db = await getDb();
  return db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.isVisible, true))
    .orderBy(desc(schema.reviews.publishedAt), desc(schema.reviews.id));
});

export const getFaqs = cache(async () => {
  const db = await getDb();
  return db
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.isActive, true))
    .orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));
});

export const getPage = cache(async (slug: string) => {
  const db = await getDb();
  const [row] = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug));
  return row ?? null;
});
