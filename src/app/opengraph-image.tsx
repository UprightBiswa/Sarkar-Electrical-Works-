import { ImageResponse } from "next/og";

export const alt = "Sarkar Electrical Works — Electrical repair shop, Shivmandir, Siliguri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 80% 20%, rgba(250,204,21,.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(34,211,238,.25), transparent 40%), #04060c",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <path
              d="M32 3l6 3.5 7-.6 3.5 6 6.3 3.1-.2 7L58 28l-2.4 6.5 1.7 6.8-5.6 4.2-2 6.7-7 .9L37 58.5 32 61l-5-2.5-5.7-4.4-7-.9-2-6.7-5.6-4.2 1.7-6.8L6 28l3.4-6-.2-7 6.3-3.1 3.5-6 7 .6z"
              fill="#facc15"
            />
            <circle cx="32" cy="32" r="21" fill="#080c17" />
            <path d="M35.5 14 22 35h9l-3 15 14.5-22h-9.2z" fill="#facc15" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            <span>Sarkar</span>
            <span style={{ color: "#facc15", marginLeft: 12 }}>Electrical Works</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>All kinds of electrical goods,</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#facc15" }}>repaired right.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#94a3b8" }}>
            Fans · Geysers · Mixers · Irons · Pumps · Power tools
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#cbd5e1" }}>
          <span>Indirapally, Shivmandir, Siliguri</span>
          <span style={{ color: "#facc15" }}>Rated 5.0 on Google · 095476 29016</span>
        </div>
      </div>
    ),
    size,
  );
}
