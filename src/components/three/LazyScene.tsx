"use client";

import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FanScene = dynamic(() => import("./FanScene"), { ssr: false });

/** Mounts the WebGL scene only once it scrolls near the viewport (saves GPU & JS on first load). */
export function LazyFanScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  return (
    <div ref={ref} className={className}>
      {inView && <FanScene />}
    </div>
  );
}
