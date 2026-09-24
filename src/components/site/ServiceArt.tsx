import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Generated artwork for a service (used when no photo is uploaded):
 * gradient field, circuit traces with travelling "current", glowing icon.
 * Deterministic per slug, pure SVG/CSS — zero image bytes to download.
 */
const PALETTES = [
  ["#facc15", "#f59e0b", "#22d3ee"],
  ["#22d3ee", "#0ea5e9", "#facc15"],
  ["#fb923c", "#facc15", "#22d3ee"],
  ["#a3e635", "#22d3ee", "#facc15"],
  ["#facc15", "#22d3ee", "#a78bfa"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ServiceArt({ seed, icon, className, large = false }: { seed: string; icon: string; className?: string; large?: boolean }) {
  const h = hash(seed);
  const [c1, c2, c3] = PALETTES[h % PALETTES.length];
  const id = `sa-${h}`;
  const flip = h % 2 === 0;
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-ink-900", className)}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`${id}-bg`} cx={flip ? "75%" : "25%"} cy="30%" r="85%">
            <stop offset="0" stopColor={c1} stopOpacity=".42" />
            <stop offset=".45" stopColor={c2} stopOpacity=".12" />
            <stop offset="1" stopColor="#04060c" stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity=".05" />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#${id}-grid)`} />
        <rect width="400" height="250" fill={`url(#${id}-bg)`} />
        {/* circuit traces */}
        <g fill="none" strokeWidth="2" strokeLinecap="round" transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
          {[
            "M0 60h90l30 30h80",
            "M0 190h60l40-40h60",
            "M400 40h-70l-30 30v40",
            "M400 210h-110l-25-25h-45",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={i % 2 ? c3 : c1} strokeOpacity=".25" />
              <path d={d} stroke={i % 2 ? c3 : c1} strokeDasharray="14 220" className="sa-current" style={{ animationDelay: `${i * 0.7}s` }} />
            </g>
          ))}
          {[
            [200, 90],
            [160, 150],
            [300, 110],
            [220, 185],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#04060c" stroke={i % 2 ? c3 : c1} strokeWidth="2" />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full blur-2xl" style={{ background: c1, opacity: 0.35 }} />
          <div
            className={cn(
              "relative grid place-items-center rounded-3xl border border-white/15 bg-ink-950/60 backdrop-blur-md",
              large ? "h-32 w-32" : "h-20 w-20",
            )}
            style={{ boxShadow: `0 0 50px -10px ${c1}`, color: c1 }}
          >
            <Icon name={icon} className={large ? "h-16 w-16" : "h-10 w-10"} />
          </div>
        </div>
      </div>
    </div>
  );
}
