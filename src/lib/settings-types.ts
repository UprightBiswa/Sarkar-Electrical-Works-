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

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Sarkar+Electrical+Works+Shivmandir/@26.7048384,88.3606269,17z/data=!4m6!3m5!1s0x39e44700365b4fb5:0x8950349704d668dc!8m2!3d26.7048384!4d88.3606269!16s%2Fg%2F11wxjr01vq";

export const DEFAULT_SETTINGS: SiteSettings = {
  shopName: "Sarkar Electrical Works",
  tagline: "Electrical goods repair shop in Shivmandir, Siliguri",
  logoText: "SEW",
  phone: "+91 95476 29016",
  whatsapp: "919547629016",
  email: "",
  address: "Indirapally, Shivmandir, near Gajen More, Siliguri, Bara Mohansingh, West Bengal",
  area: "Shivmandir",
  city: "Siliguri",
  state: "West Bengal",
  pincode: "734011",
  mapUrl: GOOGLE_MAPS_URL,
  lat: 26.7048384,
  lng: 88.3606269,
  hours: [
    { day: "Monday", open: "09:00", close: "20:00" },
    { day: "Tuesday", open: "09:00", close: "20:00" },
    { day: "Wednesday", open: "09:00", close: "20:00" },
    { day: "Thursday", open: "09:00", close: "20:00" },
    { day: "Friday", open: "09:00", close: "20:00" },
    { day: "Saturday", open: "09:00", close: "20:00" },
    { day: "Sunday", open: "09:00", close: "20:00" },
  ],
  hero: {
    badge: "Indirapally · Shivmandir · Siliguri",
    title: "All kinds of electrical goods,",
    highlight: "repaired right.",
    subtitle:
      "Fans, geysers, mixer grinders, irons, electric kettles, water pumps, angle grinders, wood planers, marble cutters, water heaters and more — expert repair at our Shivmandir shop, near Gajen More.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
  },
  stats: [
    { label: "Google rating", value: "5.0★" },
    { label: "Google reviews", value: "4" },
    { label: "Appliance types repaired", value: "10+" },
    { label: "Shop opens", value: "9 AM" },
  ],
  whyUs: [
    { icon: "Wrench", title: "All-round repair", text: "Home appliances, motors, pumps and power tools — one shop for every electrical item." },
    { icon: "BadgeCheck", title: "Honest diagnosis", text: "We check the fault first and tell you the cost before any repair." },
    { icon: "Cog", title: "Quality spare parts", text: "Reliable replacement parts so your appliance lasts longer." },
    { icon: "Store", title: "Local & reachable", text: "Walk in at Indirapally, Shivmandir — near Gajen More, Siliguri." },
  ],
  process: [
    { title: "Bring or book", text: "Walk in with your item, call us, or book a repair online." },
    { title: "Diagnose", text: "We test the item and explain the fault and the price." },
    { title: "Repair", text: "Fixed carefully with proper parts and a final safety test." },
    { title: "Pick up", text: "We inform you when it's ready. Support after repair too." },
  ],
  socials: { facebook: "", instagram: "", youtube: "", x: "" },
  google: {
    placeId: "",
    searchQuery: "Sarkar Electrical Works Shivmandir Siliguri",
    rating: 5,
    reviewCount: 4,
    reviewUrl: GOOGLE_MAPS_URL,
    lastSyncedAt: "",
  },
  seo: {
    title: "Sarkar Electrical Works Shivmandir — Electrical Repair Shop in Siliguri",
    description:
      "Sarkar Electrical Works, Indirapally, Shivmandir (near Gajen More), Siliguri 734011. Repair of fans, geysers, mixer grinders, irons, kettles, water pumps, angle grinders, wood planers, marble cutters & water heaters. Call 095476 29016.",
    keywords:
      "electrical repair Siliguri, electronics repair shop Shivmandir, fan repair Siliguri, geyser repair Siliguri, mixer grinder repair, water pump repair Siliguri, angle grinder repair, Sarkar Electrical Works",
  },
  notifyEmail: "",
  bookingNotice: "We'll call you to confirm. Shop opens at 9 AM.",
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
