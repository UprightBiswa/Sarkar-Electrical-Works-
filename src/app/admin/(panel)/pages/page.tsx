import Link from "next/link";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { savePage } from "@/app/actions/admin";
import { ActionForm, SubmitButton } from "@/components/admin/client";
import { PageTitle, Panel } from "@/components/admin/ui";
import Markdown from "@/components/Markdown";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Pages" };

const PAGES = [
  { slug: "about", label: "About us", path: "/about" },
  { slug: "privacy-policy", label: "Privacy policy", path: "/privacy-policy" },
  { slug: "terms-and-conditions", label: "Terms & conditions", path: "/terms-and-conditions" },
  { slug: "refund-policy", label: "Refund policy", path: "/refund-policy" },
];

export default async function PagesAdmin({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  await requireAdmin();
  const { slug = "about" } = await searchParams;
  const current = PAGES.find((p) => p.slug === slug) ?? PAGES[0];
  const db = await getDb();
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug, current.slug));

  return (
    <>
      <PageTitle title="Pages" subtitle="Edit About us and policy pages. Supports simple formatting: ## Heading, - list, **bold**, [link](url)." />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/pages?slug=${p.slug}`}
            className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium", p.slug === current.slug ? "bg-volt-500 text-ink-950" : "bg-white/5 text-slate-400 hover:text-white")}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Editor"
          actions={
            <a href={current.path} target="_blank" className="inline-flex items-center gap-1 text-xs text-volt-400">
              View <ExternalLink className="h-3 w-3" />
            </a>
          }
        >
          <ActionForm action={savePage} className="space-y-4" key={current.slug}>
            <input type="hidden" name="slug" value={current.slug} />
            <div>
              <label className="label">Title</label>
              <input name="title" defaultValue={page?.title ?? current.label} className="input" />
            </div>
            <div>
              <label className="label">Meta description (SEO)</label>
              <input name="metaDescription" defaultValue={page?.metaDescription} className="input" />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea name="content" defaultValue={page?.content} rows={22} className="input font-mono text-xs leading-6" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Last updated {formatDate(page?.updatedAt, true)}</span>
              <SubmitButton pendingText="Saving…">Save page</SubmitButton>
            </div>
          </ActionForm>
        </Panel>
        <Panel title="Preview (saved version)">
          <Markdown content={page?.content ?? ""} />
        </Panel>
      </div>
    </>
  );
}
