import type { Metadata } from "next";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import Pagination from "@/components/Pagination";
import { GoogleBadge, PageHero, ReviewCard } from "@/components/site/ui";
import { getSettings, getVisibleReviews } from "@/lib/data";
import { parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Google reviews of Sarkar Electrical Works, Shivmandir, Siliguri — rated 5.0 by customers.",
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ReviewsPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page);
  const [s, reviews] = await Promise.all([getSettings(), getVisibleReviews(page)]);
  return (
    <>
      <PageHero eyebrow="Reviews" title="Trusted by our neighbours" subtitle="Real feedback from customers across Siliguri." />
      <section className="container-x">
        <Reveal className="flex flex-col items-center gap-4">
          <GoogleBadge rating={s.google.rating} count={s.google.reviewCount} url={s.google.reviewUrl} />
          <a href={s.google.reviewUrl} target="_blank" rel="noreferrer" className="btn-primary">
            Read all reviews / write one on Google
          </a>
        </Reveal>
        {reviews.rows.length > 0 ? (
          <>
            <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.rows.map((r) => (
                <StaggerItem key={r.id}>
                  <ReviewCard r={r} />
                </StaggerItem>
              ))}
            </Stagger>
            <Pagination
              className="mt-10"
              page={reviews.page}
              pageCount={reviews.pageCount}
              total={reviews.total}
              href={(p) => (p === 1 ? "/reviews" : `/reviews?page=${p}`)}
            />
          </>
        ) : (
          <p className="mt-14 text-center text-slate-400">
            Our Google reviews will appear here soon — meanwhile, read them on Google Maps.
          </p>
        )}
      </section>
    </>
  );
}
