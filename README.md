# Sarkar Electrical Works — Website & Admin

Website + admin panel for **Sarkar Electrical Works**, Indirapally, Shivmandir (near Gajen More), Siliguri 734011 · ☎ 095476 29016.

Built with **Next.js 16** (App Router), **Drizzle ORM + Neon Postgres**, Tailwind CSS v4, Three.js (React Three Fiber), Framer Motion, Lottie, Vercel Analytics / Speed Insights / Blob.

## Run locally

```bash
npm install
npm run db:setup     # creates tables + one-time seed (safe to re-run)
npm run dev          # http://localhost:3000   admin: http://localhost:3000/admin
```

Locally no database is needed: it uses an embedded Postgres saved in `./.pglite`, and uploads go to `public/uploads`. Admin login comes from `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
Stop `npm run dev` before running `npm run build` or `npm run db:*`, because the local DB is single-process.

## Deploy on Vercel (live)

1. **vercel.com → Add New → Project →** import this GitHub repo.
2. **Environment Variables:** add only two:
   - `ADMIN_EMAIL` = your login email
   - `ADMIN_PASSWORD` = a strong password
3. **Deploy.** The first build fails with "DATABASE_URL is missing". That's expected.
4. Project → **Storage → Create → Neon (Postgres)** → connect to the project. This adds `DATABASE_URL` automatically.
5. Project → **Storage → Create → Blob** → connect. This adds `BLOB_READ_WRITE_TOKEN` (needed for image uploads).
6. **Deployments → Redeploy.** During the build, `vercel-build` creates the tables and seeds the content once. Open `/admin` and log in.
7. (Optional) Project → **Analytics** and **Speed Insights** → Enable.

**How the live database works:** Neon is the real database. Every deploy runs `scripts/setup-db.ts`, which applies only *new* migrations and seeds only when the database is empty. Your bookings, messages and admin edits are never overwritten. You can browse the data in the Neon dashboard (Vercel → Storage → Neon → Open).

**Changing the database schema later:** edit `src/lib/db/schema.ts` → `npm run db:generate` → commit the new file in `drizzle/` → push. Vercel applies it on deploy.

**Optional env vars** (add any time, then redeploy):
`GOOGLE_PLACES_API_KEY` (Google rating, reviews and photos) · `RESEND_API_KEY` + `ADMIN_NOTIFY_EMAIL` (email alerts and replies) · `NEXT_PUBLIC_SITE_URL` (custom domain).

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
