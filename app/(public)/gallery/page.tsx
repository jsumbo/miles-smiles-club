"use client";

import { useEffect, useState } from "react";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { listGalleryImagesAction } from "../actions";
import type { GalleryImage } from "@/types/firestore";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listGalleryImagesAction().then((images) => {
      setImages(images);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Gallery</p>
      <h1 className="mt-4 font-heading text-3xl tracking-wide sm:text-4xl lg:text-5xl">From the runs</h1>
      <p className="mt-4 max-w-2xl text-text-muted sm:text-lg">
        Moments from the road — early mornings, finish lines, and everything in between.
      </p>

      <div className="mt-10">
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="text-text-muted">No photos yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}
