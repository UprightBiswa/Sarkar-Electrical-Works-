"use server";

import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { createSession, destroySession, requireAdmin, requireOwner } from "@/lib/auth";
import { saveImage } from "@/lib/upload";
import { emailEnabled, esc, sendEmail } from "@/lib/email";
import { fetchPlaceDetails, findPlaceId, getPhotoUri } from "@/lib/google-reviews";
import { mergeSettings, type SiteSettings } from "@/lib/settings-types";
import { getSettings, TAGS } from "@/lib/data";
import { log } from "@/lib/logger";
import { clientIp, rateLimit, retryText } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";

export type ActionState = { ok: boolean; message: string; data?: Record<string, string> };
const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

type Tag = (typeof TAGS)[keyof typeof TAGS];

/** Expire the tagged data cache immediately, then refresh ISR pages that use it. */
function invalidate(...tags: Tag[]) {
  for (const t of tags) revalidateTag(t, { expire: 0 });
  revalidatePath("/", "layout");
}

/* ───────────────────────── Auth ───────────────────────── */

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return fail("Enter your email and password.");

  const ip = await clientIp();
  const rl = await rateLimit("login", `${ip}:${email}`);
  if (!rl.ok) return fail(`Too many attempts. Try again in ${retryText(rl.resetIn)}.`);

  const db = await getDb();
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email));
  // Constant-ish time: always run a bcrypt compare
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!admin || !valid) {
    log.warn("admin.login_failed", { ip, email });
    return fail("Invalid email or password.");
  }
  log.info("admin.login", { adminId: admin.id, ip });

  await db.update(schema.admins).set({ lastLoginAt: new Date() }).where(eq(schema.admins.id, admin.id));
  await createSession(admin);
  const next = str(fd, "next");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ───────────────────────── Bookings ───────────────────────── */

const STATUSES = ["new", "confirmed", "in_progress", "completed", "cancelled"];

export async function updateBooking(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = str(fd, "status");
  const patch: Partial<typeof schema.bookings.$inferInsert> = { updatedAt: new Date() };
  if (STATUSES.includes(status)) patch.status = status;
  if (fd.has("adminNote")) patch.adminNote = str(fd, "adminNote").slice(0, 2000);
  const db = await getDb();
  await db.update(schema.bookings).set(patch).where(eq(schema.bookings.id, id));
  revalidatePath("/admin", "layout");
}

export async function deleteBooking(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.bookings).where(eq(schema.bookings.id, Number(fd.get("id"))));
  revalidatePath("/admin", "layout");
}

/* ───────────────────────── Messages ───────────────────────── */

export async function setMessageRead(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db
    .update(schema.contactMessages)
    .set({ isRead: fd.get("isRead") === "true" })
    .where(eq(schema.contactMessages.id, Number(fd.get("id"))));
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, Number(fd.get("id"))));
  revalidatePath("/admin", "layout");
}

export async function replyToMessage(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const id = Number(fd.get("id"));
  const reply = str(fd, "reply");
  if (reply.length < 2) return fail("Write a reply first.");
  const db = await getDb();
  const [msg] = await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  if (!msg) return fail("Message not found.");
  const settings = await getSettings();

  let sent = false;
  if (emailEnabled()) {
    const res = await sendEmail({
      to: msg.email,
      subject: `Re: ${msg.subject || "Your enquiry"} — ${settings.shopName}`,
      replyTo: settings.email || undefined,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
        <p>Hi ${esc(msg.name)},</p>
        <p style="white-space:pre-wrap">${esc(reply)}</p>
        <p>— ${esc(admin.name)}, ${esc(settings.shopName)}<br/>${esc(settings.phone)}</p>
        <hr/><p style="color:#888;font-size:13px">Your message:<br/>${esc(msg.message)}</p></div>`,
    });
    sent = res.ok;
    if (!res.ok && !("skipped" in res)) return fail(`Email failed: ${res.error}`);
  }
  await db
    .update(schema.contactMessages)
    .set({ reply, repliedAt: new Date(), isRead: true })
    .where(eq(schema.contactMessages.id, id));
  revalidatePath("/admin", "layout");
  return ok(sent ? "Reply emailed to customer." : "Reply saved. (Email not configured — use the mailto link to send.)");
}

/* ───────────────────────── Services ───────────────────────── */

export async function saveService(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = Number(fd.get("id") || 0);
  const title = str(fd, "title");
  if (title.length < 2) return fail("Title is required.");
  const slug = slugify(str(fd, "slug") || title);
  const db = await getDb();

  const clash = await db
    .select({ id: schema.services.id })
    .from(schema.services)
    .where(id ? and(eq(schema.services.slug, slug), ne(schema.services.id, id)) : eq(schema.services.slug, slug));
  if (clash.length) return fail(`Another service already uses the URL "${slug}".`);

  let image = str(fd, "image");
  const file = fd.get("imageFile");
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveImage(file, "services");
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  const values = {
    title,
    slug,
    image,
    shortDesc: str(fd, "shortDesc"),
    description: str(fd, "description"),
    icon: str(fd, "icon") || "Zap",
    priceFrom: str(fd, "priceFrom"),
    features: str(fd, "features")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    isActive: bool(fd, "isActive"),
    isFeatured: bool(fd, "isFeatured"),
    sortOrder: Number(fd.get("sortOrder") || 0),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(schema.services).set(values).where(eq(schema.services.id, id));
  } else {
    await db.insert(schema.services).values(values);
  }
  invalidate(TAGS.services);
  redirect("/admin/services?saved=1");
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.services).where(eq(schema.services.id, Number(fd.get("id"))));
  invalidate(TAGS.services);
}

export async function toggleService(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  const field = fd.get("field") === "isFeatured" ? "isFeatured" : "isActive";
  await db
    .update(schema.services)
    .set({ [field]: fd.get("value") === "true" })
    .where(eq(schema.services.id, Number(fd.get("id"))));
  invalidate(TAGS.services);
}

/* ───────────────────────── Gallery ───────────────────────── */

export async function uploadGalleryImages(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const db = await getDb();
  const category = str(fd, "category") || "Work";
  const title = str(fd, "title");
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const url = str(fd, "url");
  if (!files.length && !url) return fail("Choose at least one image or paste an image URL.");

  const urls: string[] = [];
  try {
    for (const f of files) urls.push(await saveImage(f, "gallery"));
  } catch (e) {
    return fail((e as Error).message);
  }
  if (url) urls.push(url);
  await db.insert(schema.galleryImages).values(urls.map((u) => ({ url: u, category, title })));
  invalidate(TAGS.gallery);
  return ok(`${urls.length} image${urls.length > 1 ? "s" : ""} added.`);
}

export async function updateGalleryImage(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  const patch: Partial<typeof schema.galleryImages.$inferInsert> = {};
  if (fd.has("title")) patch.title = str(fd, "title");
  if (fd.has("category")) patch.category = str(fd, "category");
  if (fd.has("isActive")) patch.isActive = fd.get("isActive") === "true";
  if (fd.has("sortOrder")) patch.sortOrder = Number(fd.get("sortOrder") || 0);
  await db.update(schema.galleryImages).set(patch).where(eq(schema.galleryImages.id, Number(fd.get("id"))));
  invalidate(TAGS.gallery);
}

export async function deleteGalleryImage(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, Number(fd.get("id"))));
  invalidate(TAGS.gallery);
}

/* ───────────────────────── Pages ───────────────────────── */

export async function savePage(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const slug = str(fd, "slug");
  const title = str(fd, "title");
  if (!slug || !title) return fail("Title is required.");
  const db = await getDb();
  const values = {
    slug,
    title,
    content: String(fd.get("content") ?? ""),
    metaDescription: str(fd, "metaDescription"),
    updatedAt: new Date(),
  };
  await db
    .insert(schema.pages)
    .values(values)
    .onConflictDoUpdate({ target: schema.pages.slug, set: values });
  invalidate(TAGS.pages);
  return ok("Page saved.");
}

/* ───────────────────────── FAQs ───────────────────────── */

export async function saveFaq(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = Number(fd.get("id") || 0);
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (!question || !answer) return fail("Question and answer are required.");
  const values = { question, answer, sortOrder: Number(fd.get("sortOrder") || 0), isActive: bool(fd, "isActive") };
  const db = await getDb();
  if (id) await db.update(schema.faqs).set(values).where(eq(schema.faqs.id, id));
  else await db.insert(schema.faqs).values(values);
  invalidate(TAGS.faqs);
  return ok("FAQ saved.");
}

export async function deleteFaq(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.faqs).where(eq(schema.faqs.id, Number(fd.get("id"))));
  invalidate(TAGS.faqs);
}

/* ───────────────────────── Settings ───────────────────────── */

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  let data: Partial<SiteSettings>;
  try {
    data = JSON.parse(String(fd.get("data") ?? "{}"));
  } catch {
    return fail("Invalid settings data.");
  }
  const file = fd.get("heroFile");
  if (file instanceof File && file.size > 0) {
    try {
      data.hero = { ...mergeSettings(data).hero, image: await saveImage(file, "hero") };
    } catch (e) {
      return fail((e as Error).message);
    }
  }
  const current = await getSettings();
  // Google sync fields are managed by the sync action
  const merged = mergeSettings({
    ...data,
    google: { ...mergeSettings(data).google, rating: current.google.rating, reviewCount: current.google.reviewCount, lastSyncedAt: current.google.lastSyncedAt },
  });
  const db = await getDb();
  await db
    .insert(schema.siteSettings)
    .values({ id: 1, data: merged, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteSettings.id, set: { data: merged, updatedAt: new Date() } });
  invalidate(TAGS.settings);
  return { ok: true, message: "Settings saved.", data: { heroImage: merged.hero.image } };
}

/* ───────────────────────── Reviews ───────────────────────── */

export async function syncGoogleReviews(): Promise<ActionState> {
  await requireAdmin();
  const settings = await getSettings();
  try {
    const placeId =
      settings.google.placeId || (await findPlaceId(settings.google.searchQuery, settings.lat, settings.lng));
    const place = await fetchPlaceDetails(placeId);
    const db = await getDb();
    let count = 0;
    for (const r of place.reviews ?? []) {
      const values = {
        source: "google",
        externalId: r.name,
        authorName: r.authorAttribution?.displayName || "Google user",
        authorPhoto: r.authorAttribution?.photoUri || "",
        authorUrl: r.authorAttribution?.uri || "",
        rating: r.rating ?? 5,
        text: r.originalText?.text || r.text?.text || "",
        relativeTime: r.relativePublishTimeDescription || "",
        publishedAt: r.publishTime ? new Date(r.publishTime) : null,
      };
      await db
        .insert(schema.reviews)
        .values(values)
        .onConflictDoUpdate({
          target: schema.reviews.externalId,
          set: {
            authorName: values.authorName,
            authorPhoto: values.authorPhoto,
            authorUrl: values.authorUrl,
            rating: values.rating,
            text: values.text,
            relativeTime: values.relativeTime,
            publishedAt: values.publishedAt,
          },
        });
      count++;
    }
    // Import the shop's Google Maps photos into the gallery (skips ones already imported)
    let photosAdded = 0;
    const existing = new Set((await db.select({ url: schema.galleryImages.url }).from(schema.galleryImages)).map((g) => g.url));
    for (const ph of (place.photos ?? []).slice(0, 10)) {
      const uri = await getPhotoUri(ph.name);
      if (!uri || existing.has(uri)) continue;
      await db.insert(schema.galleryImages).values({
        url: uri,
        title: ph.authorAttributions?.[0]?.displayName ? `Photo by ${ph.authorAttributions[0].displayName}` : "Our shop",
        category: "Shop",
        sortOrder: -1,
      });
      photosAdded++;
    }
    log.info("google.synced", { reviews: count, photosAdded });

    const next = mergeSettings({
      ...settings,
      google: {
        ...settings.google,
        placeId: place.id,
        rating: place.rating ?? 0,
        reviewCount: place.userRatingCount ?? 0,
        reviewUrl: place.googleMapsUri || settings.google.reviewUrl,
        lastSyncedAt: new Date().toISOString(),
      },
    });
    await db
      .insert(schema.siteSettings)
      .values({ id: 1, data: next })
      .onConflictDoUpdate({ target: schema.siteSettings.id, set: { data: next, updatedAt: new Date() } });
    invalidate(TAGS.reviews, TAGS.settings, TAGS.gallery);
    return ok(`Synced ${count} reviews and ${photosAdded} new photos · Google rating ${place.rating ?? "—"} (${place.userRatingCount ?? 0} reviews).`);
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function saveReview(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const authorName = str(fd, "authorName");
  const text = str(fd, "text");
  const rating = Math.min(5, Math.max(1, Number(fd.get("rating") || 5)));
  if (!authorName || !text) return fail("Name and review text are required.");
  const db = await getDb();
  await db.insert(schema.reviews).values({
    source: "manual",
    authorName,
    text,
    rating,
    relativeTime: str(fd, "relativeTime"),
    publishedAt: new Date(),
  });
  invalidate(TAGS.reviews, TAGS.settings, TAGS.gallery);
  return ok("Review added.");
}

export async function toggleReview(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db
    .update(schema.reviews)
    .set({ isVisible: fd.get("isVisible") === "true" })
    .where(eq(schema.reviews.id, Number(fd.get("id"))));
  invalidate(TAGS.reviews, TAGS.settings, TAGS.gallery);
}

export async function deleteReview(fd: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.reviews).where(eq(schema.reviews.id, Number(fd.get("id"))));
  invalidate(TAGS.reviews, TAGS.settings, TAGS.gallery);
}

/* ───────────────────────── Admin users ───────────────────────── */

const newAdminSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "staff"]),
});

export async function createAdmin(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireOwner();
  } catch (e) {
    return fail((e as Error).message);
  }
  const parsed = newAdminSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const d = parsed.data;
  const db = await getDb();
  const email = d.email.toLowerCase();
  const [exists] = await db.select({ id: schema.admins.id }).from(schema.admins).where(eq(schema.admins.email, email));
  if (exists) return fail("An admin with this email already exists.");
  await db.insert(schema.admins).values({
    name: d.name,
    email,
    role: d.role,
    passwordHash: await bcrypt.hash(d.password, 10),
  });
  revalidatePath("/admin/users");
  return ok(`Admin ${email} created.`);
}

export async function deleteAdmin(fd: FormData) {
  const me = await requireOwner();
  const id = Number(fd.get("id"));
  if (id === me.id) throw new Error("You cannot delete yourself.");
  const db = await getDb();
  await db.delete(schema.admins).where(eq(schema.admins.id, id));
  revalidatePath("/admin/users");
}

export async function changePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 8) return fail("New password must be at least 8 characters.");
  if (next !== String(fd.get("confirm") ?? "")) return fail("Passwords do not match.");
  const db = await getDb();
  const [row] = await db.select().from(schema.admins).where(eq(schema.admins.id, me.id));
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) return fail("Current password is incorrect.");
  await db
    .update(schema.admins)
    .set({ passwordHash: await bcrypt.hash(next, 10) })
    .where(eq(schema.admins.id, me.id));
  return ok("Password updated.");
}
