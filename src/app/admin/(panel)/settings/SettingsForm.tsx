"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveSettings } from "@/app/actions/admin";
import { ActionForm, ImageInput, SubmitButton } from "@/components/admin/client";
import type { SiteSettings } from "@/lib/settings-types";
import { ICON_NAMES } from "@/lib/icons";
import { cn } from "@/lib/utils";

const TABS = ["Business", "Hero", "Home sections", "Hours", "Social & Google", "SEO & alerts"] as const;

function F({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Business");
  const [imageKey, setImageKey] = useState(0); // bumps after an upload to refresh the image field

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const txt = (k: keyof SiteSettings) => ({
    value: String(s[k] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value as never),
    className: "input",
  });
  const sub = <K extends "hero" | "socials" | "google" | "seo">(k: K, f: keyof SiteSettings[K]) => ({
    value: String(s[k][f] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS((p) => ({ ...p, [k]: { ...p[k], [f]: e.target.value } })),
    className: "input",
  });
  function listEdit<K extends "stats" | "whyUs" | "process">(k: K, i: number, f: string, v: string) {
    setS((p) => ({ ...p, [k]: (p[k] as Record<string, string>[]).map((row, j) => (j === i ? { ...row, [f]: v } : row)) }));
  }

  return (
    <ActionForm
      action={saveSettings}
      onSuccess={(st) => {
        const img = st.data?.heroImage;
        if (img && img !== s.hero.image) {
          setS((p) => ({ ...p, hero: { ...p.hero, image: img } }));
          setImageKey((k) => k + 1);
        }
      }}
    >
      <input type="hidden" name="data" value={JSON.stringify(s)} />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium", tab === t ? "bg-volt-500 text-ink-950" : "bg-white/5 text-slate-400 hover:text-white")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-5 sm:p-6">
        <div className={cn("grid gap-5 sm:grid-cols-2", tab !== "Business" && "hidden")}>
          <F label="Shop name">
            <input {...txt("shopName")} />
          </F>
          <F label="Tagline">
            <input {...txt("tagline")} />
          </F>
          <F label="Phone (shown on site)">
            <input {...txt("phone")} />
          </F>
          <F label="WhatsApp number (with country code, digits only)">
            <input {...txt("whatsapp")} placeholder="919876543210" />
          </F>
          <F label="Public email">
            <input {...txt("email")} />
          </F>
          <F label="Area">
            <input {...txt("area")} />
          </F>
          <F label="Full address" className="sm:col-span-2">
            <input {...txt("address")} />
          </F>
          <F label="City">
            <input {...txt("city")} />
          </F>
          <F label="State">
            <input {...txt("state")} />
          </F>
          <F label="PIN code">
            <input {...txt("pincode")} />
          </F>
          <F label="Google Maps link">
            <input {...txt("mapUrl")} />
          </F>
          <F label="Latitude">
            <input type="number" step="any" value={s.lat} onChange={(e) => set("lat", Number(e.target.value))} className="input" />
          </F>
          <F label="Longitude">
            <input type="number" step="any" value={s.lng} onChange={(e) => set("lng", Number(e.target.value))} className="input" />
          </F>
          <F label="Booking notice (shown after booking)" className="sm:col-span-2">
            <input {...txt("bookingNotice")} />
          </F>
        </div>

        <div className={cn("grid gap-5", tab !== "Hero" && "hidden")}>
          <F label="Badge text">
            <input {...sub("hero", "badge")} />
          </F>
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Headline">
              <input {...sub("hero", "title")} />
            </F>
            <F label="Highlighted words (gradient)">
              <input {...sub("hero", "highlight")} />
            </F>
          </div>
          <F label="Subtitle">
            <textarea {...sub("hero", "subtitle")} rows={3} />
          </F>
          <ImageInput
            key={imageKey}
            label="Feature image (used in 'Why us' section & social sharing)"
            name="heroImageUrl"
            fileName="heroFile"
            defaultUrl={s.hero.image}
            onUrlChange={(v) => setS((p) => ({ ...p, hero: { ...p.hero, image: v } }))}
          />
        </div>

        <div className={cn("space-y-8", tab !== "Home sections" && "hidden")}>
          <div>
            <h3 className="mb-3 font-display font-semibold text-white">Stats</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.stats.map((st, i) => (
                <div key={i} className="flex gap-2">
                  <input value={st.value} onChange={(e) => listEdit("stats", i, "value", e.target.value)} className="input !w-28" placeholder="10+" />
                  <input value={st.label} onChange={(e) => listEdit("stats", i, "label", e.target.value)} className="input" placeholder="Label" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-display font-semibold text-white">Why choose us</h3>
            <div className="space-y-3">
              {s.whyUs.map((w, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[10rem_14rem_1fr_auto]">
                  <select value={w.icon} onChange={(e) => listEdit("whyUs", i, "icon", e.target.value)} className="input">
                    {ICON_NAMES.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                  <input value={w.title} onChange={(e) => listEdit("whyUs", i, "title", e.target.value)} className="input" placeholder="Title" />
                  <input value={w.text} onChange={(e) => listEdit("whyUs", i, "text", e.target.value)} className="input" placeholder="Text" />
                  <button type="button" onClick={() => set("whyUs", s.whyUs.filter((_, j) => j !== i))} className="grid w-10 place-items-center text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("whyUs", [...s.whyUs, { icon: "Zap", title: "", text: "" }])} className="btn-ghost !py-2 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-display font-semibold text-white">How it works (steps)</h3>
            <div className="space-y-3">
              {s.process.map((p, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[14rem_1fr_auto]">
                  <input value={p.title} onChange={(e) => listEdit("process", i, "title", e.target.value)} className="input" />
                  <input value={p.text} onChange={(e) => listEdit("process", i, "text", e.target.value)} className="input" />
                  <button type="button" onClick={() => set("process", s.process.filter((_, j) => j !== i))} className="grid w-10 place-items-center text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("process", [...s.process, { title: "", text: "" }])} className="btn-ghost !py-2 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add step
              </button>
            </div>
          </div>
        </div>

        <div className={cn("space-y-3", tab !== "Hours" && "hidden")}>
          {s.hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[7rem_1fr_1fr_auto] items-center gap-3">
              <span className="text-sm text-slate-300">{h.day}</span>
              <input
                type="time"
                value={h.open}
                disabled={h.closed}
                onChange={(e) => set("hours", s.hours.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))}
                className="input [color-scheme:dark] disabled:opacity-40"
              />
              <input
                type="time"
                value={h.close}
                disabled={h.closed}
                onChange={(e) => set("hours", s.hours.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))}
                className="input [color-scheme:dark] disabled:opacity-40"
              />
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={!!h.closed}
                  onChange={(e) => set("hours", s.hours.map((x, j) => (j === i ? { ...x, closed: e.target.checked } : x)))}
                  className="accent-yellow-400"
                />
                Closed
              </label>
            </div>
          ))}
        </div>

        <div className={cn("grid gap-5 sm:grid-cols-2", tab !== "Social & Google" && "hidden")}>
          <F label="Facebook URL">
            <input {...sub("socials", "facebook")} />
          </F>
          <F label="Instagram URL">
            <input {...sub("socials", "instagram")} />
          </F>
          <F label="YouTube URL">
            <input {...sub("socials", "youtube")} />
          </F>
          <F label="X / Twitter URL">
            <input {...sub("socials", "x")} />
          </F>
          <F label="Google Place ID (optional — found automatically on first sync)">
            <input {...sub("google", "placeId")} />
          </F>
          <F label="Google search query for your shop">
            <input {...sub("google", "searchQuery")} />
          </F>
          <F label="Google review / profile link" className="sm:col-span-2">
            <input {...sub("google", "reviewUrl")} />
          </F>
        </div>

        <div className={cn("grid gap-5", tab !== "SEO & alerts" && "hidden")}>
          <F label="SEO title">
            <input {...sub("seo", "title")} />
          </F>
          <F label="SEO description">
            <textarea {...sub("seo", "description")} rows={3} />
          </F>
          <F label="Keywords (comma separated)">
            <input {...sub("seo", "keywords")} />
          </F>
          <F label="Send booking & message alerts to (email)">
            <input {...txt("notifyEmail")} placeholder="owner@example.com" />
          </F>
          <p className="text-xs text-slate-500">Email alerts require RESEND_API_KEY in environment variables.</p>
        </div>
      </div>

      <div className="sticky bottom-4 mt-5 flex justify-end">
        <SubmitButton className="!px-8 !py-3 shadow-2xl" pendingText="Saving…">
          Save settings
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
