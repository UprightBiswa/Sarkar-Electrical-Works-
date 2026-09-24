import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/forms";
import { MapEmbed, PageHero } from "@/components/site/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getSettings } from "@/lib/data";
import { fmtTime, telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, WhatsApp, email or visit Sarkar Electrical Works in Shivmandir, Siliguri.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const cards = [
    { icon: Phone, title: "Call us", value: s.phone, href: telHref(s.phone) },
    { icon: MessageCircle, title: "WhatsApp", value: "Chat with us", href: waHref(s.whatsapp) },
    ...(s.email ? [{ icon: Mail, title: "Email", value: s.email, href: `mailto:${s.email}` }] : []),
    { icon: MapPin, title: "Visit the shop", value: `${s.area}, ${s.city}`, href: s.mapUrl },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk" subtitle="Questions, quotes or feedback — we usually reply within a few hours." />
      <section className="container-x">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: I, title, value, href }) => (
            <StaggerItem key={title}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-volt-500/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-volt-500/10 text-volt-400 transition group-hover:bg-volt-500 group-hover:text-ink-950">
                  <I className="h-5 w-5" />
                </span>
                <p className="mt-5 text-sm text-slate-400">{title}</p>
                <p className="mt-1 font-semibold break-words text-white">{value}</p>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="card p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">Send us a message</h2>
            <p className="mt-1 mb-8 text-sm text-slate-400">Fill in the form and our team will get back to you.</p>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="card relative min-h-80 flex-1 overflow-hidden p-2">
              <div className="relative h-full min-h-80 overflow-hidden rounded-xl">
                <MapEmbed lat={s.lat} lng={s.lng} className="absolute inset-0" />
              </div>
            </div>
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-display font-semibold text-white">
                <Clock className="h-4 w-4 text-volt-400" /> Opening hours
              </h3>
              <ul className="mt-4 divide-y divide-white/5 text-sm">
                {s.hours.map((h) => (
                  <li key={h.day} className="flex justify-between py-2">
                    <span className="text-slate-400">{h.day}</span>
                    <span className="text-white">{h.closed ? "Closed" : `${fmtTime(h.open)} – ${fmtTime(h.close)}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
