import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** URL-driven pagination (?page=N) — works without JS, shareable and cache-friendly. */
export default function Pagination({
  page,
  pageCount,
  href,
  total,
  className,
}: {
  page: number;
  pageCount: number;
  /** builds the link for a page number */
  href: (page: number) => string;
  total?: number;
  className?: string;
}) {
  if (pageCount <= 1) return null;
  // window of pages around the current one, with first/last and ellipses
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages.at(-1) !== "…") pages.push("…");
  }
  const btn = "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm transition";
  return (
    <nav className={cn("flex flex-wrap items-center justify-between gap-3", className)} aria-label="Pagination">
      <p className="text-xs text-slate-500">
        Page {page} of {pageCount}
        {total !== undefined && ` · ${total} total`}
      </p>
      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={href(page - 1)} className={cn(btn, "text-slate-300 hover:bg-white/10")} aria-label="Previous page" scroll={false}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(btn, "text-slate-600")}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-slate-600">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              scroll={false}
              aria-current={p === page ? "page" : undefined}
              className={cn(btn, p === page ? "bg-volt-500 font-semibold text-ink-950" : "text-slate-300 hover:bg-white/10")}
            >
              {p}
            </Link>
          ),
        )}
        {page < pageCount ? (
          <Link href={href(page + 1)} className={cn(btn, "text-slate-300 hover:bg-white/10")} aria-label="Next page" scroll={false}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(btn, "text-slate-600")}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
