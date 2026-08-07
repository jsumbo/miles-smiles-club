"use client";

import Link from "next/link";
import { MapPin, Quote } from "lucide-react";
import { JoinRunButton } from "@/components/public/JoinRunButton";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface-light border-b border-border py-16 sm:py-24 text-foreground">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpeg"
            alt="Miles & Smiles Run Club"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/50 backdrop-blur-[2px]" />
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

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">
            Founder&apos;s Story
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight tracking-wide sm:text-5xl lg:text-6xl max-w-3xl">
            Why We Run Together
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
            How a personal habit turned into Monrovia&apos;s most welcoming run community.
          </p>
        </div>
      </section>

      {/* Main Founder Story Section */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Founder Photo Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl border border-border bg-surface-card p-3 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                <img
                  src="/kiki.jpeg"
                  alt="Kiki - Founder of Miles & Smiles"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl tracking-wide">Kiki</h3>
                    <p className="text-sm font-medium text-brand-primary">Founder, Miles &amp; Smiles</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                    <MapPin className="h-3.5 w-3.5" /> Monrovia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Narrative Column */}
          <div className="lg:col-span-7 space-y-8 text-foreground">
            
            {/* Quote banner */}
            <div className="relative rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 sm:p-8">
              <Quote className="absolute top-4 right-4 h-10 w-10 text-brand-primary/20" />
              <p className="relative z-10 font-heading text-xl sm:text-2xl leading-relaxed text-foreground">
                &ldquo;Somewhere between the early mornings and the late night miles, I realized I didn&apos;t want to keep doing it alone.&rdquo;
              </p>
            </div>

            {/* Main Story Paragraphs */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-text-muted">
              <p className="first-letter:text-4xl first-letter:font-heading first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-brand-primary">
                I&apos;ve always loved running. Not for a race. Not for a medal. Just for me. A habit I picked up during my football days that never really left. There&apos;s something about it that quiets everything down.
              </p>

              <p>
                For a while, a close friend (Sweetie) kept nudging me to start a run club. She&apos;d remind me to carve out space for myself outside of work, and honestly, she was right. Somewhere between the early mornings and the late night miles, I realized I didn&apos;t want to keep doing it alone.
              </p>

              <p>
                So two months ago, I did it. I started Miles &amp; Smiles — just me, a few colleagues, and some friends finding rhythm together. What&apos;s happened since has genuinely surprised me. Our first open run on May 2nd drew over 50 people. The energy was something I didn&apos;t expect, and it hasn&apos;t slowed down since.
              </p>

              <div className="my-8 rounded-xl border border-border bg-surface-card p-6 shadow-sm">
                <p className="font-medium text-foreground">
                  We run every Thursday as a core group, and on the 1st and 3rd Saturday of each month, we open the roads to everyone.
                </p>
              </div>

              <p>
                Our next open run is this Saturday. If you&apos;re in Monrovia and you&apos;ve been looking for a reason to move — this is it. No pressure. No pace requirement. Just good people, good energy, and miles worth smiling about.
              </p>

              <p className="font-heading text-xl sm:text-2xl text-foreground pt-2">
                We&apos;re only just getting started.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
              <JoinRunButton className="rounded-md bg-brand-primary px-6 py-3.5 text-center text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover">
                Join our next run
              </JoinRunButton>
              <Link
                href="/runs"
                className="rounded-md border border-border bg-surface-card px-6 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Our runs
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
