/**
 * One-time seed. Safe to run repeatedly: it only inserts content when the
 * database is empty. `npm run db:seed -- --force` resets site content
 * (bookings, messages and admins are never deleted).
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
config({ quiet: true });

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { getDb, schema } from "../src/lib/db";
import { DEFAULT_SETTINGS } from "../src/lib/settings-types";
import { SEED_FAQS, SEED_GALLERY, SEED_PAGES, SEED_SERVICES } from "../src/lib/seed-data";

export async function seed({ force = false } = {}) {
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
    const password = process.env.ADMIN_PASSWORD || randomBytes(9).toString("base64url");
    await db.insert(schema.admins).values({
      name: process.env.ADMIN_NAME || "Owner",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "owner",
    });
    console.log(`✓ Created owner admin: ${email}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`  ⚠ ADMIN_PASSWORD not set — generated password: ${password}`);
      console.log("    Log in and change it in Admin → Admin users.");
    }
  } else {
    console.log("✓ Admin users exist — skipping admin creation.");
  }
}

// CLI: `tsx scripts/seed.ts [--force]`
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed({ force: process.argv.includes("--force") })
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
