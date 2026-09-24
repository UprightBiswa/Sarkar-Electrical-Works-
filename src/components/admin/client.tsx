"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CircleHelp,
  ExternalLink,
  FileText,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { LogoMark } from "../Logo";
import type { ActionState } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, badge: "bookings" },
  { href: "/admin/messages", label: "Messages", icon: Inbox, badge: "messages" },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Admin users", icon: Users },
] as const;

export function AdminShell({
  admin,
  counts,
  logoutAction,
  children,
}: {
  admin: { name: string; email: string; role: string };
  counts: { bookings: number; messages: number };
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        const badge = "badge" in n ? counts[n.badge] : 0;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active ? "text-ink-950" : "text-slate-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {active && <motion.span layoutId="admin-nav" className="absolute inset-0 -z-10 rounded-xl bg-volt-500" />}
            <n.icon className="h-4 w-4" />
            {n.label}
            {badge > 0 && (
              <span
                className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold",
                  active ? "bg-ink-950 text-volt-400" : "bg-volt-500/15 text-volt-300",
                )}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" className="flex items-center gap-2.5 px-2 pt-2">
        <LogoMark className="h-9 w-9" />
        <div>
          <p className="font-display text-sm font-bold text-white">Sarkar Electrical</p>
          <p className="text-[11px] tracking-wider text-slate-500 uppercase">Admin panel</p>
        </div>
      </Link>
      {nav}
      <div className="space-y-2 border-t border-white/5 pt-4">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View website
        </a>
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-volt-500 to-spark-500 text-sm font-bold text-ink-950">
            {admin.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{admin.name}</p>
            <p className="truncate text-xs text-slate-500 capitalize">{admin.role}</p>
          </div>
          <form action={logoutAction}>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-rose-400" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-ink-900 lg:block">{sidebar}</aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-ink-900 lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/5 bg-ink-950/80 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <span className="font-display font-semibold">Admin</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

const PendingContext = createContext(false);

export function SubmitButton({ children, className, pendingText }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const status = useFormStatus();
  const pending = useContext(PendingContext) || status.pending;
  return (
    <button type="submit" disabled={pending} className={cn("btn-primary", className)}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/** Form bound to an (state, formData) server action; shows the returned message. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  onSuccess,
}: {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  onSuccess?: (state: ActionState) => void;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  const ref = useRef<HTMLFormElement>(null);
  const [dismissed, setDismissed] = useState<ActionState | null>(null);
  const visible = dismissed !== state;

  useEffect(() => {
    if (!state.message) return;
    if (state.ok && resetOnSuccess) ref.current?.reset();
    if (state.ok) onSuccess?.(state);
    const t = setTimeout(() => setDismissed(state), 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per new action result
  }, [state]);

  return (
    <form
      ref={ref}
      className={className}
      onSubmit={(e) => {
        // Submit manually so React doesn't auto-reset fields (keeps input when validation fails)
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
      <AnimatePresence>
        {visible && state.message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-3 rounded-lg px-3 py-2 text-sm",
              state.ok ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300",
            )}
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export function ConfirmButton({
  message = "Are you sure?",
  children,
  className,
  title,
}: {
  message?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function AutoSubmitSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}

export function ImageInput({
  name = "image",
  fileName = "imageFile",
  defaultUrl = "",
  label = "Image",
  onUrlChange,
}: {
  name?: string;
  fileName?: string;
  defaultUrl?: string;
  label?: string;
  onUrlChange?: (url: string) => void;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [preview, setPreview] = useState(defaultUrl);
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-900 sm:w-48">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.includes("unsplash") && !preview.includes("?") ? `${preview}?w=400` : preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-slate-500">No image</div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <input
            type="file"
            name={fileName}
            accept="image/*"
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-volt-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-950 hover:file:bg-volt-400"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          <input
            name={name}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setPreview(e.target.value);
              onUrlChange?.(e.target.value);
            }}
            className="input"
            placeholder="…or paste an image URL"
          />
          <p className="text-xs text-slate-500">Upload replaces the URL. Max 4 MB (JPG, PNG, WEBP).</p>
        </div>
      </div>
    </div>
  );
}
