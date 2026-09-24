"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { telHref, waHref } from "@/lib/utils";
import { SocialIcon } from "./SocialIcons";

export default function FloatingActions({ phone, whatsapp, shopName }: { phone: string; whatsapp: string; shopName: string }) {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        href={waHref(whatsapp, `Hello ${shopName}, I need a repair.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <SocialIcon name="whatsapp" className="relative h-7 w-7" />
      </motion.a>
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.35, type: "spring" }}
        href={telHref(phone)}
        aria-label="Call now"
        className="grid h-14 w-14 place-items-center rounded-full bg-volt-500 text-ink-950 shadow-lg shadow-volt-500/30 transition hover:scale-110 md:hidden"
      >
        <Phone className="h-6 w-6" />
      </motion.a>
    </div>
  );
}
