import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  index,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("staff"), // owner | staff
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDesc: text("short_desc").notNull().default(""),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("Zap"),
  image: text("image").notNull().default(""),
  priceFrom: text("price_from").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull().default(""),
    address: text("address").notNull().default(""),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    serviceName: text("service_name").notNull().default(""),
    preferredDate: text("preferred_date").notNull().default(""),
    preferredTime: text("preferred_time").notNull().default(""),
    message: text("message").notNull().default(""),
    status: text("status").notNull().default("new"), // new | confirmed | in_progress | completed | cancelled
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("bookings_status_idx").on(t.status), index("bookings_created_idx").on(t.createdAt)],
);

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    subject: text("subject").notNull().default(""),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    reply: text("reply").notNull().default(""),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_created_idx").on(t.createdAt)],
);

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull().default(""),
  category: text("category").notNull().default("Work"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pages = pgTable("pages", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  source: text("source").notNull().default("manual"), // google | manual
  externalId: text("external_id").unique(),
  authorName: text("author_name").notNull(),
  authorPhoto: text("author_photo").notNull().default(""),
  authorUrl: text("author_url").notNull().default(""),
  rating: real("rating").notNull().default(5),
  text: text("text").notNull().default(""),
  relativeTime: text("relative_time").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const pageViews = pgTable(
  "page_views",
  {
    id: serial("id").primaryKey(),
    path: text("path").notNull(),
    referrer: text("referrer").notNull().default(""),
    country: text("country").notNull().default(""),
    device: text("device").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("pv_created_idx").on(t.createdAt)],
);

export type Admin = typeof admins.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Faq = typeof faqs.$inferSelect;

/** Fixed-window rate limiting shared across serverless instances. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});
