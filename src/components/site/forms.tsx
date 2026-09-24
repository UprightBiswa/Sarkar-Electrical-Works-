"use client";

import { startTransition, useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { submitBooking, submitContact, type FormState } from "@/app/actions/public";
import LottiePlayer from "../LottiePlayer";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

function Field({
  label,
  name,
  error,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/** Submits without React's automatic form reset, so typed values survive validation errors. */
function submitWith(action: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };
}

function Honeypot() {
  return (
    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
  );
}

function Success({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-8 text-center"
    >
      <LottiePlayer name="success" loop={false} className="h-36 w-36" />
      <h3 className="mt-2 font-display text-2xl font-semibold text-white">Done!</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{message}</p>
      <button onClick={onReset} className="btn-ghost mt-6">
        Send another
      </button>
    </motion.div>
  );
}

export function BookingForm({
  services,
  defaultServiceId,
}: {
  services: { id: number; title: string }[];
  defaultServiceId?: number;
}) {
  const [key, setKey] = useState(0);
  return <BookingFormInner key={key} services={services} defaultServiceId={defaultServiceId} onReset={() => setKey((k) => k + 1)} />;
}

function BookingFormInner({
  services,
  defaultServiceId,
  onReset,
}: {
  services: { id: number; title: string }[];
  defaultServiceId?: number;
  onReset: () => void;
}) {
  const [state, action, pending] = useActionState(submitBooking, initial);
  const e = state.errors ?? {};
  const today = new Date().toISOString().slice(0, 10);

  if (state.ok) return <Success message={state.message} onReset={onReset} />;

  return (
    <form onSubmit={submitWith(action)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <Field label="Your name *" name="name" error={e.name}>
        <input id="name" name="name" className="input" placeholder="Full name" autoComplete="name" required />
      </Field>
      <Field label="Phone *" name="phone" error={e.phone}>
        <input id="phone" name="phone" className="input" placeholder="+91 98xxxxxxxx" inputMode="tel" autoComplete="tel" required />
      </Field>
      <Field label="Service" name="serviceId" error={e.serviceId}>
        <select id="serviceId" name="serviceId" className="input" defaultValue={defaultServiceId ?? ""}>
          <option value="">General enquiry / Not sure</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Email (optional)" name="email" error={e.email}>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field label="Address *" name="address" error={e.address} className="sm:col-span-2">
        <input id="address" name="address" className="input" placeholder="House no., street, area, landmark" autoComplete="street-address" />
      </Field>
      <Field label="Preferred date" name="preferredDate">
        <input id="preferredDate" name="preferredDate" type="date" min={today} className="input [color-scheme:dark]" />
      </Field>
      <Field label="Preferred time" name="preferredTime">
        <select id="preferredTime" name="preferredTime" className="input">
          <option value="">Any time</option>
          <option>Morning (9am – 12pm)</option>
          <option>Afternoon (12pm – 4pm)</option>
          <option>Evening (4pm – 8pm)</option>
        </select>
      </Field>
      <Field label="Describe the problem" name="message" error={e.message} className="sm:col-span-2">
        <textarea id="message" name="message" rows={4} className="input resize-none" placeholder="e.g. MCB trips when AC is switched on…" />
      </Field>
      <FormFooter state={state} pending={pending} label="Confirm booking" />
    </form>
  );
}

export function ContactForm() {
  const [key, setKey] = useState(0);
  return <ContactFormInner key={key} onReset={() => setKey((k) => k + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const e = state.errors ?? {};
  if (state.ok) return <Success message={state.message} onReset={onReset} />;
  return (
    <form onSubmit={submitWith(action)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <Field label="Name *" name="name" error={e.name}>
        <input id="name" name="name" className="input" placeholder="Your name" autoComplete="name" />
      </Field>
      <Field label="Email *" name="email" error={e.email}>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field label="Phone" name="phone" error={e.phone}>
        <input id="phone" name="phone" className="input" placeholder="Optional" inputMode="tel" autoComplete="tel" />
      </Field>
      <Field label="Subject" name="subject" error={e.subject}>
        <input id="subject" name="subject" className="input" placeholder="How can we help?" />
      </Field>
      <Field label="Message *" name="message" error={e.message} className="sm:col-span-2">
        <textarea id="message" name="message" rows={5} className="input resize-none" placeholder="Write your message…" />
      </Field>
      <FormFooter state={state} pending={pending} label="Send message" />
    </form>
  );
}

function FormFooter({ state, pending, label }: { state: FormState; pending: boolean; label: string }) {
  return (
    <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
      <AnimatePresence mode="wait">
        {state.message && !state.ok ? (
          <motion.p
            key={state.message}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-rose-400"
          >
            {state.message}
          </motion.p>
        ) : (
          <p className="text-xs text-slate-500">We never share your details.</p>
        )}
      </AnimatePresence>
      <button type="submit" disabled={pending} className={cn("btn-primary !px-7 !py-3")}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Sending…" : label}
      </button>
    </div>
  );
}
