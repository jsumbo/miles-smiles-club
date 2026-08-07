import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface-light px-4 text-center text-foreground">
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 w-full opacity-[0.08]"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="route-draw"
          style={{ ["--route-length" as string]: 2400 }}
          d="M0 220 C 150 100, 300 260, 450 160 S 750 60, 900 180 S 1100 260, 1200 140"
          stroke="var(--brand-secondary)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo.jpg" alt="Miles & Smiles Run Club" className="h-14 w-14 rounded-xl object-cover" />
        </Link>

        <div className="mt-8 flex items-center justify-center gap-2 text-brand-primary">
          <MapPinOff className="h-5 w-5" />
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Off route</p>
        </div>

        <h1 className="mt-4 font-heading text-5xl tracking-wide sm:text-6xl">404</h1>
        <p className="mt-3 max-w-sm text-base text-text-muted sm:text-lg">
          Looks like this trail doesn&apos;t exist. Let&apos;s get you back on the road.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-md bg-brand-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover"
          >
            Back to home
          </Link>
          <Link
            href="/runs"
            className="rounded-md border border-border bg-surface-card px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            See upcoming runs
          </Link>
        </div>
      </div>
    </div>
  );
}
