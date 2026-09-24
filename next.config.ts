import type { NextConfig } from "next";

const usingPglite = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("pglite");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Let the dev server work when opened as 127.0.0.1 (e.g. VS Code preview) or from a phone on Wi-Fi
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.*.*", "10.*.*.*"],
  compress: true,
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: {
      // Vercel functions accept request bodies up to ~4.5MB
      bodySizeLimit: "4mb",
    },
    // The local embedded DB (PGlite) is single-process: prerender with one worker.
    ...(usingPglite ? { cpus: 1 } : {}),
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
  },
  images: {
    // Serve modern formats; Vercel's image CDN caches each size/format variant.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Long-lived CDN/browser caching for static brand assets & local uploads
        source: "/:file(.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2))",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
};

export default nextConfig;
