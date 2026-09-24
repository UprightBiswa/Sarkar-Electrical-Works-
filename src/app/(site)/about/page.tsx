import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Markdown from "@/components/Markdown";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/site/ui";
import { getPage, getSettings } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { img } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPage("about");
  return { title: p?.title ?? "About Us", description: p?.metaDescription };
}

export default async function AboutPage() {
  const [p, s] = await Promise.all([getPage("about"), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`The team behind ${s.shopName}`}
        subtitle={s.tagline}
        image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
      />
      <section className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src={img("https://images.unsplash.com/photo-1558618666-fcd25c85cd64", 1000)}
              alt="Repair workshop"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 45vw"
            />
          </div>
          <div className="glass absolute -bottom-6 left-6 right-6 grid grid-cols-2 gap-4 rounded-2xl p-5">
            {s.stats.slice(0, 2).map((st) => (
              <div key={st.label}>
                <p className="font-display text-3xl font-bold text-volt-400">
                  <Counter value={st.value} />
                </p>
                <p className="text-xs text-slate-400">{st.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Markdown content={p?.content ?? ""} />
          <Link href="/contact" className="btn-primary mt-8">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <section className="container-x pt-28">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.whyUs.map((w) => (
            <StaggerItem key={w.title} className="card p-6">
              <Icon name={w.icon} className="h-7 w-7 text-volt-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{w.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{w.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
