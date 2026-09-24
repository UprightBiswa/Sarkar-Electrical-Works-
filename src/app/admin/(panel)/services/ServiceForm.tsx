"use client";

import { useState } from "react";
import { saveService } from "@/app/actions/admin";
import { ActionForm, ImageInput, SubmitButton } from "@/components/admin/client";
import type { Service } from "@/lib/db/schema";
import { ICON_NAMES, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function ServiceForm({ service }: { service?: Service }) {
  const [icon, setIcon] = useState(service?.icon ?? "Zap");
  return (
    <ActionForm action={saveService} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={service?.id ?? ""} />
      <input type="hidden" name="icon" value={icon} />
      <div className="space-y-5 rounded-2xl border border-white/10 bg-ink-900/70 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Title *</label>
            <input name="title" defaultValue={service?.title} required className="input" placeholder="e.g. House Wiring" />
          </div>
          <div>
            <label className="label">URL slug</label>
            <input name="slug" defaultValue={service?.slug} className="input" placeholder="auto from title" />
          </div>
        </div>
        <div>
          <label className="label">Short description</label>
          <input name="shortDesc" defaultValue={service?.shortDesc} className="input" placeholder="One line shown on cards" />
        </div>
        <div>
          <label className="label">Full description</label>
          <textarea name="description" defaultValue={service?.description} rows={6} className="input" />
        </div>
        <div>
          <label className="label">What&apos;s included (one per line)</label>
          <textarea name="features" defaultValue={service?.features.join("\n")} rows={6} className="input font-mono text-xs" />
        </div>
        <ImageInput defaultUrl={service?.image ?? ""} />
      </div>

      <div className="space-y-5">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/70 p-5">
          <div>
            <label className="label">Price label</label>
            <input name="priceFrom" defaultValue={service?.priceFrom} className="input" placeholder="₹499 or Get a quote" />
          </div>
          <div>
            <label className="label">Sort order</label>
            <input name="sortOrder" type="number" defaultValue={service?.sortOrder ?? 0} className="input" />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" name="isActive" defaultChecked={service?.isActive ?? true} className="h-4 w-4 accent-yellow-400" />
            Visible on website
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" name="isFeatured" defaultChecked={service?.isFeatured ?? false} className="h-4 w-4 accent-yellow-400" />
            Featured on home page
          </label>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-5">
          <span className="label">Icon</span>
          <div className="grid grid-cols-6 gap-2">
            {ICON_NAMES.map((n) => (
              <button
                type="button"
                key={n}
                title={n}
                onClick={() => setIcon(n)}
                className={cn(
                  "grid aspect-square place-items-center rounded-lg border transition",
                  icon === n ? "border-volt-500 bg-volt-500 text-ink-950" : "border-white/10 text-slate-400 hover:text-white",
                )}
              >
                <Icon name={n} className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <SubmitButton className="w-full !py-3" pendingText="Saving…">
          {service ? "Save changes" : "Create service"}
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
