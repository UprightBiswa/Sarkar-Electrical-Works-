import type { Metadata } from "next";
import { Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/ui";
import { Reveal } from "@/components/motion";
import LottiePlayer from "@/components/LottiePlayer";
import { getActiveServices, getSettings } from "@/lib/data";
import { telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Repair",
  description: "Book a repair for fans, geysers, mixers, irons, pumps and power tools at Sarkar Electrical Works, Shivmandir, Siliguri.",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const [services, s] = await Promise.all([getActiveServices(), getSettings()]);
  const pre = services.find((x) => x.slug === service)?.id;

  return (
    <>
      <PageHero eyebrow="Booking" title="Book a repair" subtitle={s.bookingNotice} />
      <section className="container-x grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Reveal className="card p-6 sm:p-10">
          <BookingForm services={services.map((x) => ({ id: x.id, title: x.title }))} defaultServiceId={pre} />
        </Reveal>
        <Reveal delay={0.1} className="space-y-4">
          <div className="card flex flex-col items-center p-6 text-center">
            <LottiePlayer name="bolt" className="h-28 w-28" />
            <p className="font-display text-lg font-semibold text-white">Need help right now?</p>
            <p className="mt-1 text-sm text-slate-400">For urgent faults, call or WhatsApp us directly.</p>
            <div className="mt-5 grid w-full gap-2">
              <a href={telHref(s.phone)} className="btn-primary">
                <Phone className="h-4 w-4" /> {s.phone}
              </a>
              <a href={waHref(s.whatsapp, `Hello ${s.shopName}, I need a repair.`)} target="_blank" rel="noreferrer" className="btn-ghost">
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </div>
          </div>
          {[
            { icon: Clock, t: "Quick confirmation", d: "We call back to confirm your slot." },
            { icon: ShieldCheck, t: "No obligation", d: "Get a clear quote before any work." },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="card flex gap-4 p-5">
              <I className="h-5 w-5 shrink-0 text-volt-400" />
              <div>
                <p className="font-semibold text-white">{t}</p>
                <p className="text-sm text-slate-400">{d}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
