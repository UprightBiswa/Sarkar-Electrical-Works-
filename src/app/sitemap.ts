import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getActiveServices } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const services = await getActiveServices().catch(() => []);
  const staticPaths = ["", "/services", "/book", "/gallery", "/reviews", "/about", "/contact", "/privacy-policy", "/terms-and-conditions", "/refund-policy"];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt, priority: 0.8 })),
  ];
}
