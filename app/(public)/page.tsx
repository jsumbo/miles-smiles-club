"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/public/Hero";
import { StatsBand } from "@/components/public/StatsBand";
import { EventCard } from "@/components/public/EventCard";
import { ProductCard } from "@/components/public/ProductCard";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { getContentBlock } from "@/lib/firestore/content";
import { listUpcomingEvents } from "@/lib/firestore/events";
import { listProducts } from "@/lib/firestore/products";
import { listGalleryImages } from "@/lib/firestore/gallery";
import type { GalleryImage, Product, RunEvent } from "@/types/firestore";

// Sensible defaults so the page looks right before any content is seeded
// in the admin panel — an empty store shouldn't mean an empty page.
const HERO_DEFAULTS = {
  title: "Built by the people who show up",
  subtitle:
    "Miles & Smile started with a simple idea: running is better when you don't do it alone.\n\nWhat started as a few people showing up has grown into a community that supports each other well beyond the miles.",
  ctaLabel: "Join a run",
};

const STATS_DEFAULTS = { members: "240+", km: "58,000", years: "1", weekly: "3" };

export default function LandingPage() {
  const [heroValue, setHeroValue] = useState(HERO_DEFAULTS);
  const [statsValue, setStatsValue] = useState(STATS_DEFAULTS);
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getContentBlock("landing-hero"),
      getContentBlock("landing-stats"),
      listUpcomingEvents(3),
      listProducts({ activeOnly: true }),
      listGalleryImages(),
    ]).then(([hero, stats, events, products, gallery]) => {
      setHeroValue({ ...HERO_DEFAULTS, ...hero?.value });
      setStatsValue({ ...STATS_DEFAULTS, ...stats?.value });
      setEvents(events);
      setProducts(products);
      setGallery(gallery);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <>
      <Hero title={heroValue.title} subtitle={heroValue.subtitle} ctaLabel={heroValue.ctaLabel} />

      <StatsBand
        stats={[
          { label: "Runners", value: statsValue.members },
          { label: "Km logged", value: statsValue.km },
          { label: "Years running", value: statsValue.years },
          { label: "Runs / week", value: statsValue.weekly },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-heading text-2xl tracking-wide sm:text-3xl">Next up</h2>
          <Link href="/runs" className="text-sm font-semibold text-brand-primary hover:underline">
            All runs →
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-text-muted">
            No runs on the calendar yet — check back soon, or add one from the admin panel.
          </p>
        )}
      </section>

      {gallery.length > 0 && (
        <section className="bg-surface-card py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-heading text-2xl tracking-wide sm:text-3xl">From the runs</h2>
              <Link href="/gallery" className="text-sm font-semibold text-brand-primary hover:underline">
                Full gallery →
              </Link>
            </div>
            <div className="mt-6 sm:mt-8">
              <GalleryGrid images={gallery.slice(0, 8)} />
            </div>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-heading text-2xl tracking-wide sm:text-3xl">From the shop</h2>
              <Link href="/shop" className="text-sm font-semibold text-brand-primary hover:underline">
                Shop all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
