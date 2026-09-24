"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn, img } from "@/lib/utils";

type Item = { id: number; url: string; title: string; category: string };

export default function GalleryGrid({ items, filter = true }: { items: Item[]; filter?: boolean }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shown.length]);

  return (
    <>
      {filter && cats.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition",
                cat === c ? "text-ink-950" : "text-slate-300 hover:text-white",
              )}
            >
              {cat === c && <motion.span layoutId="gal-pill" className="absolute inset-0 -z-10 rounded-full bg-volt-500" />}
              {c}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        <AnimatePresence>
          {shown.map((it, idx) => (
            <motion.button
              layout
              key={it.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpen(idx)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10"
            >
              <Image
                src={img(it.url, 900)}
                alt={it.title || it.category}
                width={900}
                height={idx % 3 === 0 ? 1100 : 700}
                className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="text-left">
                  <span className="text-xs font-semibold tracking-wider text-volt-400 uppercase">{it.category}</span>
                  <p className="font-display text-lg font-semibold text-white">{it.title}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open !== null && shown[open] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur"
            onClick={() => setOpen(null)}
          >
            <button className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open - 1 + shown.length) % shown.length);
              }}
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 sm:left-6"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <motion.div
              key={shown[open].id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[75vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={img(shown[open].url, 1800)} alt={shown[open].title} fill className="object-contain" sizes="100vw" />
            </motion.div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open + 1) % shown.length);
              }}
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 sm:right-6"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute bottom-6 text-sm text-slate-300">{shown[open].title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
