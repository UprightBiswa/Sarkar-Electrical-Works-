"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { emailTable, sendEmail } from "@/lib/email";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> };

const phoneRe = /^[+\d][\d\s-]{7,15}$/;

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(phoneRe, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]),
  address: z.string().trim().min(5, "Please enter your address").max(300),
  serviceId: z.string().optional(),
  preferredDate: z.string().max(20).optional().default(""),
  preferredTime: z.string().max(40).optional().default(""),
  message: z.string().trim().max(1500).optional().default(""),
});

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export async function submitBooking(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("company")) return { ok: true, message: "Thank you!" }; // honeypot
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  }
  const d = parsed.data;
  try {
    const db = await getDb();
    let serviceId: number | null = null;
    let serviceName = "General enquiry";
    if (d.serviceId && Number(d.serviceId) > 0) {
      const [svc] = await db
        .select({ id: schema.services.id, title: schema.services.title })
        .from(schema.services)
        .where(eq(schema.services.id, Number(d.serviceId)));
      if (svc) {
        serviceId = svc.id;
        serviceName = svc.title;
      }
    }
    const [row] = await db
      .insert(schema.bookings)
      .values({
        name: d.name,
        phone: d.phone,
        email: d.email,
        address: d.address,
        serviceId,
        serviceName,
        preferredDate: d.preferredDate,
        preferredTime: d.preferredTime,
        message: d.message,
      })
      .returning({ id: schema.bookings.id });

    const settings = await getSettings();
    const notify = settings.notifyEmail || process.env.ADMIN_NOTIFY_EMAIL || "";
    await sendEmail({
      to: notify,
      subject: `New booking #${row.id}: ${serviceName} — ${d.name}`,
      replyTo: d.email || undefined,
      html: emailTable(`New booking #${row.id}`, [
        ["Service", serviceName],
        ["Name", d.name],
        ["Phone", d.phone],
        ["Email", d.email],
        ["Address", d.address],
        ["Preferred date", d.preferredDate],
        ["Preferred time", d.preferredTime],
        ["Details", d.message],
      ]),
    });
    if (d.email) {
      await sendEmail({
        to: d.email,
        subject: `We received your booking — ${settings.shopName}`,
        html: emailTable(`Thanks ${d.name}! Your booking #${row.id} is received.`, [
          ["Service", serviceName],
          ["Preferred date", d.preferredDate],
          ["Preferred time", d.preferredTime],
          ["Note", settings.bookingNotice],
          ["Call us", settings.phone],
        ]),
      });
    }
    return { ok: true, message: `Booking #${row.id} received! ${settings.bookingNotice}` };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong. Please call us directly." };
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Please enter a valid email"),
  phone: z.union([z.literal(""), z.string().trim().regex(phoneRe, "Please enter a valid phone number")]),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(3000),
});

export async function submitContact(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("company")) return { ok: true, message: "Thank you!" };
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  }
  const d = parsed.data;
  try {
    const db = await getDb();
    await db.insert(schema.contactMessages).values(d);
    const settings = await getSettings();
    await sendEmail({
      to: settings.notifyEmail || process.env.ADMIN_NOTIFY_EMAIL || "",
      subject: `New message: ${d.subject || "Website enquiry"} — ${d.name}`,
      replyTo: d.email,
      html: emailTable("New contact message", [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Subject", d.subject],
        ["Message", d.message],
      ]),
    });
    return { ok: true, message: "Thanks! Your message has been sent. We'll get back to you soon." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong. Please try again or call us." };
  }
}
