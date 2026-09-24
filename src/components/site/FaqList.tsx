"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqList({ items }: { items: { id: number; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(items[0]?.id ?? null);
  return (
    <div className="space-y-3">
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <div
            key={f.id}
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              isOpen ? "border-volt-500/40 bg-volt-500/[0.04]" : "border-white/10 bg-ink-850/60",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="font-display font-semibold text-white">{f.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  isOpen ? "bg-volt-500 text-ink-950" : "bg-white/5 text-slate-300",
                )}
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-6 text-slate-400 sm:px-6">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
