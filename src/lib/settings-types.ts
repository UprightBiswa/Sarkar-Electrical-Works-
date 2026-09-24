export type OpeningHour = { day: string; open: string; close: string; closed?: boolean };

export type SiteSettings = {
  shopName: string;
  tagline: string;
  logoText: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl: string;
  lat: number;
  lng: number;
  hours: OpeningHour[];
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    image: string;
  };
  stats: { label: string; value: string }[];
  whyUs: { title: string; text: string; icon: string }[];
  process: { title: string; text: string }[];
  socials: { facebook: string; instagram: string; youtube: string; x: string };
  google: {
    placeId: string;
    searchQuery: string;
    rating: number;
    reviewCount: number;
    reviewUrl: string;
    lastSyncedAt: string;
  };
  seo: { title: string; description: string; keywords: string };
  notifyEmail: string;
  bookingNotice: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  shopName: "Sarkar Electrical Works",
  tagline: "Trusted electricians in Shivmandir, Siliguri",
  logoText: "SEW",
  phone: "+91 00000 00000",
  whatsapp: "910000000000",
  email: "info@sarkarelectrical.in",
  address: "Shivmandir, Siliguri, Darjeeling, West Bengal",
  area: "Shivmandir",
  city: "Siliguri",
  state: "West Bengal",
  pincode: "734011",
  mapUrl:
    "https://www.google.com/maps/place/Sarkar+Electrical+Works+Shivmandir/@26.7048384,88.3606269,17z",
  lat: 26.7048384,
  lng: 88.3606269,
  hours: [
    { day: "Monday", open: "09:00", close: "20:00" },
    { day: "Tuesday", open: "09:00", close: "20:00" },
    { day: "Wednesday", open: "09:00", close: "20:00" },
    { day: "Thursday", open: "09:00", close: "20:00" },
    { day: "Friday", open: "09:00", close: "20:00" },
    { day: "Saturday", open: "09:00", close: "20:00" },
    { day: "Sunday", open: "10:00", close: "14:00" },
  ],
  hero: {
    badge: "Shivmandir · Siliguri · Same-day service",
    title: "Power your home with",
    highlight: "safe, expert electrical work",
    subtitle:
      "House wiring, repairs, inverter & solar installation, fans, lights and appliance service — done right the first time by experienced local electricians.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e",
  },
  stats: [
    { label: "Years of experience", value: "10+" },
    { label: "Jobs completed", value: "5,000+" },
    { label: "Happy customers", value: "3,000+" },
    { label: "Response time", value: "< 2 hrs" },
  ],
  whyUs: [
    { icon: "ShieldCheck", title: "Safety first", text: "ISI-marked materials, proper earthing and code-compliant work on every job." },
    { icon: "Clock", title: "Quick response", text: "Same-day visits across Shivmandir, Siliguri and nearby areas." },
    { icon: "BadgeIndianRupee", title: "Fair pricing", text: "Clear quote before we start. No hidden charges, ever." },
    { icon: "Wrench", title: "Skilled team", text: "Experienced electricians for homes, shops and small industries." },
  ],
  process: [
    { title: "Book", text: "Call, WhatsApp or book online in under a minute." },
    { title: "Inspect", text: "We visit, diagnose the issue and share a clear quote." },
    { title: "Fix", text: "Work is done neatly with quality parts and safety checks." },
    { title: "Support", text: "Service warranty and follow-up support after the job." },
  ],
  socials: { facebook: "", instagram: "", youtube: "", x: "" },
  google: {
    placeId: "",
    searchQuery: "Sarkar Electrical Works Shivmandir Siliguri",
    rating: 0,
    reviewCount: 0,
    reviewUrl:
      "https://www.google.com/maps/place/Sarkar+Electrical+Works+Shivmandir/@26.7048384,88.3606269,17z",
    lastSyncedAt: "",
  },
  seo: {
    title: "Sarkar Electrical Works — Electrician in Shivmandir, Siliguri",
    description:
      "Sarkar Electrical Works, Shivmandir, Siliguri: house wiring, electrical repairs, inverter, solar, fan & light installation and appliance repair. Book an electrician online.",
    keywords:
      "electrician Siliguri, electrician Shivmandir, house wiring Siliguri, inverter installation Siliguri, electrical repair",
  },
  notifyEmail: "",
  bookingNotice: "We usually confirm bookings by phone within 2 hours during working hours.",
};

export function mergeSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  const d = data ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...d,
    hero: { ...DEFAULT_SETTINGS.hero, ...(d.hero ?? {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(d.socials ?? {}) },
    google: { ...DEFAULT_SETTINGS.google, ...(d.google ?? {}) },
    seo: { ...DEFAULT_SETTINGS.seo, ...(d.seo ?? {}) },
  };
}
