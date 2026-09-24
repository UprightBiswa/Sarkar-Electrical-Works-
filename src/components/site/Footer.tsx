import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Zap } from "lucide-react";
import type { SiteSettings } from "@/lib/settings-types";
import type { Service } from "@/lib/db/schema";
import { telHref } from "@/lib/utils";
import { SocialIcon } from "./SocialIcons";

export default function Footer({ s, services }: { s: SiteSettings; services: Service[] }) {
  const socials = (["facebook", "instagram", "youtube", "x"] as const).filter((k) => s.socials[k]);
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-ink-900">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-volt-500/10 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-500 text-ink-950">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold">{s.shopName}</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-400">{s.tagline}. Safe, reliable electrical services for homes and businesses.</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map((k) => (
                <a
                  key={k}
                  href={s.socials[k]}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-volt-500 hover:text-volt-400"
                  aria-label={k}
                >
                  <SocialIcon name={k} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {services.slice(0, 6).map((svc) => (
              <li key={svc.id}>
                <Link href={`/services/${svc.slug}`} className="transition hover:text-volt-400">
                  {svc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {[
              ["/about", "About us"],
              ["/gallery", "Our work"],
              ["/reviews", "Reviews"],
              ["/contact", "Contact us"],
              ["/book", "Book a service"],
              ["/privacy-policy", "Privacy policy"],
              ["/terms-and-conditions", "Terms & conditions"],
              ["/refund-policy", "Refund policy"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-volt-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-wider text-white uppercase">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" />
              <a href={s.mapUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                {s.address} {s.pincode}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" />
              <a href={telHref(s.phone)} className="hover:text-white">
                {s.phone}
              </a>
            </li>
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" />
                <a href={`mailto:${s.email}`} className="hover:text-white">
                  {s.email}
                </a>
              </li>
            )}
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" />
              <span>
                Mon–Sat {s.hours[0]?.open}–{s.hours[0]?.close}
                <br />
                Sun {s.hours[6]?.closed ? "Closed" : `${s.hours[6]?.open}–${s.hours[6]?.close}`}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {s.shopName}, {s.area}, {s.city}. All rights reserved.
          </p>
          <p>Powered by safe wiring ⚡</p>
        </div>
      </div>
    </footer>
  );
}
