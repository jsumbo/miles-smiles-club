import Link from "next/link";
import { JoinRunButton } from "@/components/public/JoinRunButton";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
}

export function Hero({ title, subtitle, ctaLabel }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface-light text-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpeg"
          alt="Miles & Smiles Run Club"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40 backdrop-blur-[2px]" />
      </div>

      <svg
        className="pointer-events-none absolute inset-x-0 -bottom-10 z-10 h-64 w-full opacity-[0.08]"
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <h1 className="max-w-2xl text-balance font-heading text-4xl leading-[1.05] tracking-wide sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-lg whitespace-pre-line text-base text-text-muted sm:mt-6 sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <JoinRunButton className="scale-in rounded-md bg-brand-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover">
            {ctaLabel}
          </JoinRunButton>
          <Link
            href="/account/join"
            className="rounded-md border border-border bg-surface-card px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Become a member
          </Link>
        </div>
      </div>
    </section>
  );
}
