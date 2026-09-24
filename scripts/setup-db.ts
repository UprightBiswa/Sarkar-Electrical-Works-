/**
 * Database setup: applies pending SQL migrations (./drizzle), then runs the
 * one-time seed. Safe to run on every deploy — already-applied migrations and
 * existing content are skipped. Vercel runs this automatically (`vercel-build`).
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
config({ quiet: true });

import { getDb } from "../src/lib/db";
import { seed } from "./seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (process.env.VERCEL && !url) {
    throw new Error(
      "DATABASE_URL is missing. In Vercel open Storage → Create/Connect a Neon database to this project, then redeploy.",
    );
  }
  const db = await getDb();
  if (url && !url.startsWith("pglite")) {
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    await migrate(db, { migrationsFolder: "./drizzle" });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await migrate(db as any, { migrationsFolder: "./drizzle" });
  }
  console.log(`✓ Migrations applied (${url && !url.startsWith("pglite") ? "Neon" : "local PGlite"})`);
  await seed();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("✗ Database setup failed:", e);
    process.exit(1);
  });
