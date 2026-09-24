import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "Sarkar Electrical Works <onboarding@resend.dev>";

export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Sends an email via Resend. Silently no-ops when RESEND_API_KEY is not configured. */
export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!process.env.RESEND_API_KEY || !opts.to) return { ok: false, skipped: true as const };
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("Email error", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    console.error("Email error", e);
    return { ok: false, error: String(e) };
  }
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function emailTable(title: string, rows: [string, string][]) {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
  <h2 style="color:#0b1220">${esc(title)}</h2>
  <table style="border-collapse:collapse;width:100%">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;width:140px">${esc(k)}</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table></div>`;
}
