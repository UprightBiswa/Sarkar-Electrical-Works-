"use client";

import dynamic from "next/dynamic";
import bolt from "@/lottie/bolt.json";
import success from "@/lottie/success.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
  return <Lottie animationData={ANIMATIONS[name]} loop={loop} autoplay className={className} aria-hidden />;
}
