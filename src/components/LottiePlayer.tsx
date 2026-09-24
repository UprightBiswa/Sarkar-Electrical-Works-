"use client";

import dynamic from "next/dynamic";
import bolt from "@/lottie/bolt.json";
import success from "@/lottie/success.json";

// LottieLight: smaller engine build (our animations use no expressions)
const Lottie = dynamic(() => import("lottie-react").then((m) => m.LottieLight), { ssr: false });

const ANIMATIONS = { bolt, success } as const;

export default function LottiePlayer({
  name,
  loop = true,
  className,
}: {
  name: keyof typeof ANIMATIONS;
  loop?: boolean;
  className?: string;
}) {
  return <Lottie src={ANIMATIONS[name]} loop={loop} autoplay className={className} aria-hidden />;
}
