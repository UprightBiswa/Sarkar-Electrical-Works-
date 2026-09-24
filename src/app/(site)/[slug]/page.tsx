import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/site/ui";
import { getPage } from "@/lib/data";
import { formatDate } from "@/lib/utils";

// Policy & info pages managed from Admin → Pages
const ALLOWED = ["privacy-policy", "terms-and-conditions", "refund-policy"];

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return ALLOWED.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!ALLOWED.includes(slug)) return {};
  const p = await getPage(slug);
  return p ? { title: p.title, description: p.metaDescription } : {};
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  if (!ALLOWED.includes(slug)) notFound();
  const p = await getPage(slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={p.title} subtitle={`Last updated ${formatDate(p.updatedAt)}`} />
      <section className="container-x">
        <Reveal className="card mx-auto max-w-3xl p-6 sm:p-12">
          <Markdown content={p.content} />
        </Reveal>
      </section>
    </>
  );
}
