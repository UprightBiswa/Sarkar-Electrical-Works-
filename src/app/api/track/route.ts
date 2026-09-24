import { NextResponse, type NextRequest } from "next/server";
import { getDb, schema } from "@/lib/db";

const BOT = /bot|crawler|spider|crawling|preview|lighthouse|headless/i;

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent") ?? "";
    if (BOT.test(ua)) return new NextResponse(null, { status: 204 });
    const body = (await req.json().catch(() => ({}))) as { path?: string; referrer?: string };
    const path = String(body.path ?? "/").slice(0, 300);
    if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });
    let referrer = "";
    try {
      if (body.referrer) {
        const host = new URL(body.referrer).host;
        if (host !== req.nextUrl.host) referrer = host;
      }
    } catch {}
    const device = /mobile|android|iphone/i.test(ua) ? "mobile" : /ipad|tablet/i.test(ua) ? "tablet" : "desktop";
    const db = await getDb();
    await db.insert(schema.pageViews).values({
      path,
      referrer,
      device,
      country: req.headers.get("x-vercel-ip-country") ?? "",
    });
  } catch (e) {
    console.error("track failed", e);
  }
  return new NextResponse(null, { status: 204 });
}
