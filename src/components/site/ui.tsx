import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Review, Service } from "@/lib/db/schema";
import { Icon } from "@/lib/icons";
import { cn, img } from "@/lib/utils";
import { Reveal, Tilt } from "../motion";
import ServiceArt from "./ServiceArt";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className="inline-flex items-center gap-2 rounded-full border border-volt-500/30 bg-volt-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-volt-300 uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt-400" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-7 text-slate-400">{subtitle}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle?: string; image?: string }) {
  return (
    <section className="noise relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      {image && (
        <>
          <Image src={img(image, 1800)} alt="" fill priority className="object-cover opacity-20" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950" />
        </>
      )}
      <div className="grid-bg absolute inset-0" />
      <div className="pointer-events-none absolute top-10 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-volt-500/15 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div>
    </section>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Tilt className="h-full">
    <Link
      href={`/services/${s.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-850 transition-[border-color,box-shadow] duration-500 hover:border-volt-500/40 hover:shadow-[0_20px_60px_-20px_rgba(250,204,21,0.35)]"
    >
      <div className="relative h-48 overflow-hidden">
        {s.image ? (
          <Image
            src={img(s.image, 800)}
            alt={s.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <ServiceArt seed={s.slug} icon={s.icon} className="transition duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/30 to-transparent" />
        <span className="absolute bottom-4 left-5 grid h-12 w-12 place-items-center rounded-2xl bg-volt-500 text-ink-950 shadow-[0_0_30px_-4px_rgba(250,204,21,0.7)] transition duration-500 group-hover:rotate-[-8deg]">
          <Icon name={s.icon} className="h-6 w-6" />
        </span>
        {s.priceFrom && (
          <span className="glass absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium text-white">
            {s.priceFrom.startsWith("₹") ? `From ${s.priceFrom}` : s.priceFrom}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <h3 className="font-display text-xl font-semibold text-white">{s.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{s.shortDesc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-volt-400">
          Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
    </Tilt>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i <= Math.round(rating) ? "fill-volt-400 text-volt-400" : "text-slate-600")}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <Stars rating={r.rating} />
      <blockquote className="mt-4 line-clamp-6 flex-1 text-sm leading-6 text-slate-300">“{r.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {r.authorPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.authorPhoto} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-volt-500 to-spark-500 font-bold text-ink-950">
            {r.authorName.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {r.authorUrl ? (
              <a href={r.authorUrl} target="_blank" rel="noreferrer" className="hover:underline">
                {r.authorName}
              </a>
            ) : (
              r.authorName
            )}
          </p>
          <p className="text-xs text-slate-500">
            {r.source === "google" ? "Google review" : "Customer"} {r.relativeTime && `· ${r.relativeTime}`}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function GoogleBadge({ rating, count, url }: { rating: number; count: number; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="glass inline-flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:border-white/25"
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-white">{rating ? rating.toFixed(1) : "★"}</span>
          <Stars rating={rating || 5} />
        </div>
        <p className="text-xs text-slate-400">{count ? `${count} Google reviews` : "Review us on Google"}</p>
      </div>
    </a>
  );
}

export function MapEmbed({ lat, lng, className }: { lat: number; lng: number; className?: string }) {
  return (
    <iframe
      title="Shop location on Google Maps"
      src={`https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`}
      className={cn("h-full w-full border-0 grayscale-[35%] invert-[0.9] hue-rotate-180", className)}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
