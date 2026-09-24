import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Login" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <div className="noise relative grid min-h-screen place-items-center overflow-hidden bg-ink-950 px-4">
      <div className="grid-bg absolute inset-0" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-volt-500/20 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto h-16 w-16 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" animated />
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-400">Sarkar Electrical Works — staff only</p>
        </div>
        <div className="glass rounded-3xl p-6 shadow-2xl sm:p-8">
          <LoginForm next={next ?? ""} />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
