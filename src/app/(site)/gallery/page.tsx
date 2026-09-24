import type { Metadata } from "next";
import GalleryGrid from "@/components/site/GalleryGrid";
import { PageHero } from "@/components/site/ui";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from the Sarkar Electrical Works repair shop in Shivmandir, Siliguri.",
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHero eyebrow="Gallery" title="Inside the workshop" subtitle="Repairs, testing and tools from our Shivmandir shop." />
      <section className="container-x">
        {items.length ? (
          <GalleryGrid items={items} />
        ) : (
          <p className="text-center text-slate-400">Photos coming soon.</p>
        )}
      </section>
    </>
  );
}
