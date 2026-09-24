import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { BookingForm } from "@/components/site/forms";
import { Reveal } from "@/components/motion";
import { ServiceCard } from "@/components/site/ui";
import ServiceArt from "@/components/site/ServiceArt";
import { getActiveServices, getServiceBySlug, getSettings } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { img, telHref } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

// Prebuild every active service page; new ones render on first request (dynamicParams).
export async function generateStaticParams() {
  const services = await getActiveServices().catch(() => []);
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = await getServiceBySlug(slug);
  if (!svc) return {};
  const s = await getSettings();
  return {
    title: `${svc.title} in ${s.city}`,
    description: svc.shortDesc,
    openGraph: { images: svc.image ? [img(svc.image, 1200)] : [] },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [svc, all, s] = await Promise.all([getServiceBySlug(slug), getActiveServices(), getSettings()]);
  if (!svc) notFound();
  const others = all.filter((x) => x.id !== svc.id).slice(0, 3);

  return (
    <>
      <section className="noise relative overflow-hidden pt-32 pb-16 sm:pt-40">
        {svc.image && (
          <>
            <Image src={img(svc.image, 1800)} alt="" fill priority className="object-cover opacity-25" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-ink-950/85 to-ink-950" />
          </>
        )}
        <div className="grid-bg absolute inset-0" />
        <div className="container-x relative">
          <Reveal>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
          </Reveal>
          <Reveal delay={0.05} className="mt-6 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-volt-500 text-ink-950 shadow-[0_0_40px_-6px_rgba(250,204,21,0.7)]">
              <Icon name={svc.icon} className="h-7 w-7" />
            </span>
            {svc.priceFrom && (
              <span className="glass rounded-full px-4 py-1.5 text-sm text-white">
                {svc.priceFrom.startsWith("₹") ? `Starting from ${svc.priceFrom}` : svc.priceFrom}
              </span>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">{svc.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">{svc.shortDesc}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10">
            {svc.image ? (
              <Image src={img(svc.image, 1400)} alt={svc.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 55vw" />
            ) : (
              <ServiceArt seed={svc.slug} icon={svc.icon} large />
            )}
          </Reveal>
          <Reveal className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-white">About this service</h2>
            <p className="mt-4 leading-7 whitespace-pre-line text-slate-300">{svc.description}</p>
          </Reveal>
          {svc.features.length > 0 && (
            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-white">What&apos;s included</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {svc.features.map((f) => (
                  <li key={f} className="card flex items-start gap-3 p-4 text-sm text-slate-200">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-volt-500/15 text-volt-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-white">Book {svc.title.toLowerCase()}</h2>
            <p className="mt-1 mb-6 text-sm text-slate-400">{s.bookingNotice}</p>
            <BookingForm services={all.map((x) => ({ id: x.id, title: x.title }))} defaultServiceId={svc.id} />
          </div>
          <a href={telHref(s.phone)} className="btn-ghost mt-4 w-full !py-3.5">
            <Phone className="h-4 w-4" /> Prefer to talk? Call {s.phone}
          </a>
        </Reveal>
      </section>

      {others.length > 0 && (
        <section className="container-x pt-24">
          <h2 className="font-display text-2xl font-semibold text-white">Other services</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <ServiceCard key={o.id} s={o} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
