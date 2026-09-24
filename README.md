# Sarkar Electrical Works — Website & Admin

Website + admin panel for **Sarkar Electrical Works**, Indirapally, Shivmandir (near Gajen More), Siliguri 734011 · ☎ 095476 29016.

Built with **Next.js 16** (App Router), **Drizzle ORM + Neon Postgres**, Tailwind CSS v4, Three.js (React Three Fiber), Framer Motion, Lottie, Vercel Analytics / Speed Insights / Blob.

## Run locally

```bash
npm install
cp .env.example .env.local     # fill SESSION_SECRET + ADMIN_PASSWORD at least
npm run db:setup               # create tables + one-time seed (safe to re-run)
npm run dev                    # http://localhost:3000   admin: http://localhost:3000/admin
```

Without `DATABASE_URL`, an embedded Postgres (**PGlite**, stored in `./.pglite`) is used, so it runs offline. It is single-process, so stop `npm run dev` before running `npm run build` or the DB scripts.

| Script | What it does |
|---|---|
| `npm run db:push` | Sync tables to the schema (`src/lib/db/schema.ts`) |
| `npm run db:seed` | One-time seed. Skips when content exists; `-- --force` resets site content (never bookings, messages or admins) |
| `npm run db:studio` | Browse the database |
| `npm run typecheck` / `npm run lint` | Checks |

## Deploy to Vercel

1. Push to GitHub → import in Vercel.
2. **Storage → Neon** (Postgres) → connect → sets `DATABASE_URL`.
3. **Storage → Blob** → connect → sets `BLOB_READ_WRITE_TOKEN` (image uploads).
4. Add env vars: `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, optional `GOOGLE_PLACES_API_KEY`, `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`.
5. Locally with the Neon `DATABASE_URL` in `.env.local`: `npm run db:setup` (once).
6. Enable **Analytics** and **Speed Insights** in the Vercel project.

## Admin panel (`/admin`, separate login)

Dashboard (bookings & visits charts, top pages, devices) · Bookings (status, notes, call/WhatsApp, search, pagination) · Messages (read/unread, reply by email via Resend) · Services (CRUD, image upload, icon, featured) · Gallery (multi-upload) · Reviews (sync Google rating, reviews **and shop photos** via Places API; manual testimonials) · Pages (About, policies, markdown) · FAQs · Settings (shop details, hero, stats, hours, socials, SEO, alert email) · Admin users (owner/staff, change password).

## Performance & security

- **Caching:** public pages use ISR (`revalidate = 3600`) served from the CDN. Data reads use `unstable_cache` with tags (`src/lib/data.ts`), and admin saves call `revalidateTag` so changes appear immediately.
- **Images:** `next/image` with AVIF/WebP, responsive sizes, 30-day optimizer cache. Services without photos get generated SVG artwork (no bytes to download).
- **Rate limiting:** Postgres fixed-window limiter (`src/lib/rate-limit.ts`), shared across serverless instances. Limits: bookings 5/h, contact 5/h, login 8/15 min, tracking 120/min.
- **Auth:** bcrypt passwords, HS256 JWT in an httpOnly cookie. `src/proxy.ts` does an optimistic redirect check, and every admin page and server action re-verifies the session against the database.
- **Headers:** HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy. `/admin` is `no-store` + `noindex`.
- **Logging:** structured JSON logs (`src/lib/logger.ts`) with masked personal data, searchable in Vercel → Logs.
- **SEO:** metadata, JSON-LD LocalBusiness, sitemap, robots, generated OG image and favicon.
- **Spam:** honeypot fields and server-side zod validation.
