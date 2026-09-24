import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, ServiceCard } from "@/components/site/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getActiveServices, getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Repair Services",
    description: `Fan, geyser, mixer grinder, iron, kettle, water pump and power tool repair by ${s.shopName}, ${s.area}, ${s.city}.`,
  };
}

export default async function ServicesPage() {
  const services = await getActiveServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Repair services"
        subtitle="Choose a service to see what we fix, or book a repair — we'll call you to confirm."
        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
      />
      <section className="container-x pb-10">
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.id}>
              <ServiceCard s={s} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="card mt-14 flex flex-col items-center justify-between gap-6 p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Don&apos;t see what you need?</h2>
            <p className="mt-1 text-slate-400">Tell us the problem — if it runs on electricity, we can probably fix it.</p>
          </div>
          <Link href="/book" className="btn-primary shrink-0">
            Book a repair <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
