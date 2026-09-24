import { asc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { deleteFaq, saveFaq } from "@/app/actions/admin";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/client";
import { PageTitle, Panel, Toggle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";

export const metadata = { title: "FAQs" };

export default async function FaqsAdmin() {
  await requireAdmin();
  const db = await getDb();
  const rows = await db.select().from(schema.faqs).orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));

  return (
    <>
      <PageTitle title="FAQs" subtitle="Frequently asked questions shown on the home page." />
      <div className="space-y-4">
        {rows.map((f) => (
          <Panel key={f.id}>
            <ActionForm action={saveFaq} className="space-y-3">
              <input type="hidden" name="id" value={f.id} />
              <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                <input name="question" defaultValue={f.question} className="input !py-2 font-semibold" />
                <input name="sortOrder" type="number" defaultValue={f.sortOrder} className="input !py-2" title="Order" />
              </div>
              <textarea name="answer" defaultValue={f.answer} rows={2} className="input resize-none" />
              <div className="flex items-center justify-between">
                <Toggle name="isActive" defaultChecked={f.isActive} label="Visible" />
                <SubmitButton className="!py-2">Save</SubmitButton>
              </div>
            </ActionForm>
            <form action={deleteFaq} className="mt-2 text-right">
              <input type="hidden" name="id" value={f.id} />
              <ConfirmButton message="Delete this FAQ?" className="inline-flex items-center gap-1 text-xs text-rose-400 hover:underline">
                <Trash2 className="h-3 w-3" /> Delete
              </ConfirmButton>
            </form>
          </Panel>
        ))}
        <Panel title="Add FAQ">
          <ActionForm action={saveFaq} resetOnSuccess className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
              <input name="question" className="input !py-2" placeholder="Question" />
              <input name="sortOrder" type="number" defaultValue={rows.length} className="input !py-2" />
            </div>
            <textarea name="answer" rows={2} className="input resize-none" placeholder="Answer" />
            <input type="hidden" name="isActive" value="on" />
            <SubmitButton>Add FAQ</SubmitButton>
          </ActionForm>
        </Panel>
      </div>
    </>
  );
}
