import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSettings } from "@/lib/data";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: s.seo.title, template: `%s · ${s.shopName}` },
    description: s.seo.description,
    keywords: s.seo.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      type: "website",
      siteName: s.shopName,
      title: s.seo.title,
      description: s.seo.description,
      images: s.hero.image ? [{ url: s.hero.image.includes("unsplash") ? `${s.hero.image}?w=1200&q=80` : s.hero.image }] : [],
      locale: "en_IN",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#04060c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
