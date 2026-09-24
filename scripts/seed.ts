/**
 * One-time seed. Safe to run repeatedly: it only inserts content when the
 * database is empty. Use `npm run db:seed -- --force` to reset site content
 * (bookings, messages and admins are never deleted).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { getDb, schema } from "../src/lib/db";
import { DEFAULT_SETTINGS } from "../src/lib/settings-types";
import { SEED_FAQS, SEED_GALLERY, SEED_PAGES, SEED_SERVICES } from "../src/lib/seed-data";

async function main() {
  const force = process.argv.includes("--force");
  const db = await getDb();

  const existing = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings);

  if (existing.length && !force) {
    console.log("✓ Content already seeded — skipping (use --force to reset content).");
  } else {
    if (force) {
      console.log("! --force: resetting site content…");
      await db.delete(schema.faqs);
      await db.delete(schema.galleryImages);
      await db.delete(schema.pages);
      await db.execute(sql`update bookings set service_id = null`);
      await db.delete(schema.services);
      await db.delete(schema.siteSettings);
    }

    await db.insert(schema.siteSettings).values({ id: 1, data: DEFAULT_SETTINGS });
    await db.insert(schema.services).values(SEED_SERVICES.map((s, i) => ({ ...s, sortOrder: i })));
    await db.insert(schema.galleryImages).values(SEED_GALLERY.map((g, i) => ({ ...g, sortOrder: i })));
    await db.insert(schema.pages).values(SEED_PAGES);
    await db.insert(schema.faqs).values(SEED_FAQS.map((f, i) => ({ ...f, sortOrder: i })));
    console.log(
      `✓ Seeded settings, ${SEED_SERVICES.length} services, ${SEED_GALLERY.length} gallery images, ${SEED_PAGES.length} pages, ${SEED_FAQS.length} FAQs.`,
    );
  }

  const admins = await db.select({ id: schema.admins.id }).from(schema.admins);
  if (!admins.length) {
    const email = (process.env.ADMIN_EMAIL || "admin@sarkarelectrical.in").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
    await db.insert(schema.admins).values({
      name: process.env.ADMIN_NAME || "Owner",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "owner",
    });
    console.log(`✓ Created owner admin: ${email}`);
    if (!process.env.ADMIN_PASSWORD) console.log(`  Temporary password: ${password}  ← change it after first login!`);
  } else {
    console.log("✓ Admin users exist — skipping admin creation.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
