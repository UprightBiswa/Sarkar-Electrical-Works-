import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, MapPin, Phone, Store } from "lucide-react";
import HeroCanvas from "@/components/three/HeroCanvas";
import { LazyFanScene } from "@/components/three/LazyScene";
import LottiePlayer from "@/components/LottiePlayer";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { GoogleBadge, MapEmbed, ReviewCard, SectionHeading, ServiceCard } from "@/components/site/ui";
import GalleryGrid from "@/components/site/GalleryGrid";
import FaqList from "@/components/site/FaqList";
import { getActiveServices, getFaqs, getGallery, getSettings, getVisibleReviews } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { img, telHref } from "@/lib/utils";

const REPAIR_ITEMS = [
  "Ceiling & table fans",
  "Geysers",
  "Water heaters",
  "Mixer grinders",
  "Electric irons",
  "Electric kettles",
  "Water pumps",
  "Angle grinders",
  "Wood planer machines",
  "Marble cutters",
  "Motors & rewinding",
  "Room heaters",
];

export default async function HomePage() {
  const [s, services, gallery, reviews, faqs] = await Promise.all([
    getSettings(),
    getActiveServices().catch(() => []),
    getGallery().catch(() => []),
    getVisibleReviews().then((r) => r.rows).catch(() => []),
    getFaqs().catch(() => []),
  ]);
  const featured = services.filter((x) => x.isFeatured).slice(0, 6);
  const showcase = featured.length ? featured : services.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectronicsStore"],
    name: s.shopName,
    description: s.seo.description,
    telephone: s.phone,
    email: s.email || undefined,
    image: s.hero.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address,
      addressLocality: s.city,
      addressRegion: s.state,
      postalCode: s.pincode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
    hasMap: s.mapUrl,
    openingHoursSpecification: s.hours
      .filter((h) => !h.closed)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close })),
    ...(s.google.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: s.google.rating, reviewCount: s.google.reviewCount } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ───────── Hero ───────── */}
      <section className="noise relative min-h-[100svh] overflow-hidden pt-28 lg:pt-32">
        <div className="grid-bg absolute inset-0" />
        <div className="pointer-events-none absolute -top-20 -left-40 h-[36rem] w-[36rem] rounded-full bg-volt-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-spark-500/10 blur-[120px]" />

        <div className="container-x relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10 py-8">
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-xs font-medium text-slate-200">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-800 ring-1 ring-volt-500/50">
                  <LottiePlayer name="bolt" className="h-6 w-6" />
                </span>
                {s.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl xl:text-7xl">
                {s.hero.title} <span className="text-gradient">{s.hero.highlight}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">{s.hero.subtitle}</p>
            </Reveal>
            <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/book" className="btn-primary !px-7 !py-3.5 !text-base">
                Book a repair <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={telHref(s.phone)} className="btn-ghost !px-6 !py-3.5 !text-base">
                <Phone className="h-4 w-4" /> {s.phone}
              </a>
            </Reveal>
            <Reveal delay={0.32} className="mt-10 flex flex-wrap items-center gap-6">
              <GoogleBadge rating={s.google.rating} count={s.google.reviewCount} url={s.google.reviewUrl} />
              <ul className="space-y-1.5 text-sm text-slate-300">
                {["All kinds of electrical goods", "Price told before repair", "Walk-in shop near Gajen More"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-volt-400" /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative h-[420px] sm:h-[520px] lg:h-[640px]">
            <HeroCanvas />
            <div className="glass absolute top-[12%] left-0 hidden animate-float rounded-2xl p-3 pr-5 shadow-2xl sm:flex sm:items-center sm:gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Tested before handover</p>
                <p className="text-xs text-slate-400">Every repair, every time</p>
              </div>
            </div>
            <div
              className="glass absolute right-0 bottom-[14%] hidden animate-float rounded-2xl p-3 pr-5 shadow-2xl sm:flex sm:items-center sm:gap-3"
              style={{ animationDelay: "1.5s" }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-500/20 text-volt-400">
                <Store className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Walk-in repairs</p>
                <p className="text-xs text-slate-400">{s.area}, {s.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services marquee */}
        <div className="relative mt-4 border-y border-white/5 bg-ink-900/60 py-5 backdrop-blur">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {[...services, ...services].map((x, i) => (
              <span key={i} className="flex items-center gap-3 font-display text-lg font-medium text-slate-400">
                <Icon name={x.icon} className="h-5 w-5 text-volt-500" />
                {x.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="container-x relative -mt-px py-20">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {s.stats.map((st) => (
            <StaggerItem key={st.label} className="card group relative overflow-hidden p-6 text-center sm:p-8">
              <div className="absolute inset-x-0 -bottom-16 mx-auto h-24 w-2/3 rounded-full bg-volt-500/0 blur-2xl transition duration-500 group-hover:bg-volt-500/25" />
              <p className="font-display text-3xl font-bold text-white sm:text-5xl">
                <Counter value={st.value} />
              </p>
              <p className="mt-2 text-sm text-slate-400">{st.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ───────── Services ───────── */}
      <section className="container-x py-16">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Expert <span className="text-gradient">repair services</span>
            </>
          }
          subtitle="From a noisy fan to a burnt-out angle grinder — one shop for every electrical item in your home or workshop."
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((x) => (
            <StaggerItem key={x.id}>
              <ServiceCard s={x} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Link href="/services" className="btn-ghost">
            View all {services.length} services <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* ───────── Why us ───────── */}
      <section className="container-x py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src={img(s.hero.image || "https://images.unsplash.com/photo-1621905252507-b35492cc74b4", 1000)}
                alt={`${s.shopName} repair workshop`}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
            </div>
            <div className="glass absolute -right-2 -bottom-6 flex items-center gap-4 rounded-2xl p-4 pr-6 shadow-2xl sm:-right-8">
              <LottiePlayer name="bolt" className="h-16 w-16" />
              <div>
                <p className="font-display text-2xl font-bold text-white">{s.stats[0]?.value}</p>
                <p className="text-xs text-slate-400">{s.stats[0]?.label}</p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Why choose us"
              title={
                <>
                  A repair shop you can <span className="text-gradient">trust</span>
                </>
              }
              subtitle={`Rated ${s.google.rating ? s.google.rating.toFixed(1) : "5.0"}★ on Google by customers in ${s.area} and across ${s.city}.`}
            />
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
              {s.whyUs.map((w) => (
                <StaggerItem key={w.title} className="card p-5 transition hover:border-volt-500/30">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-volt-500/20 to-spark-500/10 text-volt-400">
                    <Icon name={w.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-white">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">{w.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ───────── What we repair (3D) ───────── */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute top-1/2 left-0 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-spark-500/10 blur-[120px]" />
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="relative order-2 h-[380px] sm:h-[460px] lg:order-1">
            <div className="absolute inset-6 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent" />
            <LazyFanScene className="absolute inset-0" />
            <span className="glass absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs whitespace-nowrap text-slate-300">
              Move your mouse to change the fan speed
            </span>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              center={false}
              eyebrow="What we repair"
              title={
                <>
                  If it runs on electricity, <span className="text-gradient">we can fix it</span>
                </>
              }
              subtitle="Our Shivmandir workshop handles household appliances, motors and professional power tools."
            />
            <Stagger className="mt-8 flex flex-wrap gap-2.5">
              {REPAIR_ITEMS.map((t) => (
                <StaggerItem key={t}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:border-volt-500/50 hover:bg-volt-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt-400" />
                    {t}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-8">
              <Link href="/services" className="btn-primary">
                See repair services <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Process ───────── */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/80 to-transparent" />
        <div className="container-x relative">
          <SectionHeading eyebrow="How it works" title="Four simple steps" subtitle="Getting your appliance repaired should be easy. Here's how it works." />
          <Stagger className="relative mt-14 grid gap-6 md:grid-cols-4">
            <div className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-volt-500/0 via-volt-500/60 to-volt-500/0 md:block" />
            {s.process.map((p, i) => (
              <StaggerItem key={p.title} className="relative text-center">
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-volt-500/40 bg-ink-900 font-display text-2xl font-bold text-volt-400 shadow-[0_0_40px_-10px_rgba(250,204,21,0.6)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{p.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-slate-400">{p.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────── Gallery preview ───────── */}
      {gallery.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow="Gallery" title="Inside the workshop" subtitle="Repairs, testing and tools from our Shivmandir shop." />
          <div className="mt-12">
            <GalleryGrid items={gallery.slice(0, 6)} filter={false} />
          </div>
          <Reveal className="mt-6 text-center">
            <Link href="/gallery" className="btn-ghost">
              Open full gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>
      )}

      {/* ───────── Reviews ───────── */}
      <section className="container-x py-20">
        <SectionHeading eyebrow="Reviews" title="What our customers say" />
        <Reveal className="mt-8 flex justify-center">
          <GoogleBadge rating={s.google.rating} count={s.google.reviewCount} url={s.google.reviewUrl} />
        </Reveal>
        {reviews.length > 0 ? (
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((r) => (
              <StaggerItem key={r.id}>
                <ReviewCard r={r} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="card mx-auto mt-10 max-w-xl p-8 text-center">
            <p className="text-slate-300">Happy with our work? Your review helps neighbours find a reliable repair shop.</p>
            <a href={s.google.reviewUrl} target="_blank" rel="noreferrer" className="btn-primary mt-5">
              Write a Google review
            </a>
          </Reveal>
        )}
      </section>

      {/* ───────── FAQ + Map ───────── */}
      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} eyebrow="FAQ" title="Questions? Answers." />
            <div className="mt-10">
              <FaqList items={faqs} />
            </div>
          </div>
          <Reveal className="card overflow-hidden p-2">
            <div className="relative h-80 overflow-hidden rounded-xl lg:h-[26rem]">
              <MapEmbed lat={s.lat} lng={s.lng} />
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-volt-400" />
                <div>
                  <p className="font-semibold text-white">{s.shopName}</p>
                  <p className="text-sm text-slate-400">
                    {s.address} {s.pincode}
                  </p>
                </div>
              </div>
              <a href={s.mapUrl} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
                Directions
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="container-x py-10">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-volt-500/30 bg-gradient-to-br from-volt-500 via-volt-400 to-amber-500 p-10 text-ink-950 sm:p-14">
          <div className="absolute -top-10 -right-10 h-64 w-64 opacity-30">
            <LottiePlayer name="bolt" className="h-full w-full" />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Something stopped working? We fix it.</h2>
            <p className="mt-4 text-base text-ink-900/80 sm:text-lg">
              Bring your item to our {s.area} shop, book a repair online, or call us — we&apos;ll get it working again.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn bg-ink-950 !px-7 !py-3.5 text-white hover:bg-ink-800">
                Book now <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={telHref(s.phone)} className="btn border border-ink-950/20 bg-white/30 !px-7 !py-3.5 hover:bg-white/50">
                <Phone className="h-4 w-4" /> Call {s.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
