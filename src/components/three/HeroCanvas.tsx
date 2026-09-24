"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse-glow rounded-full bg-volt-500/30 blur-2xl" />
    </div>
  ),
});

export default function HeroCanvas() {
  return <HeroScene />;
}
