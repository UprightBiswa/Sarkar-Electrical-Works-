import {
  BadgeIndianRupee,
  BatteryCharging,
  Building2,
  Cable,
  Cctv,
  Clock,
  Cpu,
  Fan,
  Gauge,
  Hammer,
  House,
  Lightbulb,
  Plug,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Zap,
  Cable,
  Lightbulb,
  BatteryCharging,
  Sun,
  Wrench,
  Cctv,
  ShieldCheck,
  Building2,
  Clock,
  BadgeIndianRupee,
  Plug,
  Fan,
  Cpu,
  Gauge,
  Hammer,
  House,
  Sparkles,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Zap;
  return <C className={className} aria-hidden />;
}
