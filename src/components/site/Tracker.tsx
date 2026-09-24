"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Records a lightweight page view for the admin dashboard (Vercel Analytics runs separately). */
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path: pathname, referrer: document.referrer });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
