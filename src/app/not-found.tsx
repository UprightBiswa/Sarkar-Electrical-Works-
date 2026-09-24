import Link from "next/link";
import LottiePlayer from "@/components/LottiePlayer";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-4 text-center">
      <div>
        <LottiePlayer name="bolt" className="mx-auto h-40 w-40" />
        <h1 className="mt-4 font-display text-6xl font-bold text-white">404</h1>
        <p className="mt-3 text-slate-400">Looks like this circuit is broken — the page you want doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
