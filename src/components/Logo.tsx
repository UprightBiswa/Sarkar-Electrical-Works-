import { cn } from "@/lib/utils";

/**
 * Brand mark: a lightning bolt inside a gear-toothed hexagon ("repair + electric").
 * Pure SVG so it stays crisp at any size; `animated` adds a subtle glow pulse.
 */
export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id="sew-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#facc15" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="sew-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111a2e" />
          <stop offset="1" stopColor="#04060c" />
        </linearGradient>
      </defs>
      {/* gear-hex body */}
      <path
        d="M32 3l6 3.5 7-.6 3.5 6 6.3 3.1-.2 7L58 28l-2.4 6.5 1.7 6.8-5.6 4.2-2 6.7-7 .9L37 58.5 32 61l-5-2.5-5.7-4.4-7-.9-2-6.7-5.6-4.2 1.7-6.8L6 28l3.4-6-.2-7 6.3-3.1 3.5-6 7 .6z"
        fill="url(#sew-g)"
      />
      <circle cx="32" cy="32" r="21" fill="url(#sew-b)" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#22d3ee" strokeOpacity=".5" strokeWidth="1.2" />
      {/* bolt */}
      <path d="M35.5 14 22 35h9l-3 15 14.5-22h-9.2z" fill="url(#sew-g)">
        {animated && <animate attributeName="opacity" values="1;.55;1;.8;1" dur="2.4s" repeatCount="indefinite" />}
      </path>
    </svg>
  );
}

export function Logo({ name, className }: { name: string; className?: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-10 w-10 drop-shadow-[0_0_14px_rgba(250,204,21,0.45)] transition duration-500 group-hover:rotate-[30deg]" animated />
      <span className="font-display text-[17px] leading-tight font-bold tracking-tight">
        {first} <span className="text-volt-400">{rest.join(" ")}</span>
      </span>
    </span>
  );
}
