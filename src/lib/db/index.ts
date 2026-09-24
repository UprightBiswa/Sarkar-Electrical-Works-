import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __db?: Promise<DB> };

async function createDb(): Promise<DB> {
  const url = process.env.DATABASE_URL;
  if (url && !url.startsWith("pglite")) {
    return drizzle({ client: neon(url), schema });
  }
  // Local fallback: embedded Postgres (PGlite) stored in ./.pglite
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const dir = url?.replace(/^pglite:\/?\/?/, "") || "./.pglite";
  const client = new PGlite(dir);
  return drizzlePglite({ client, schema }) as unknown as DB;
}

export function getDb(): Promise<DB> {
  if (!globalForDb.__db) globalForDb.__db = createDb();
  return globalForDb.__db;
}

export { schema };
