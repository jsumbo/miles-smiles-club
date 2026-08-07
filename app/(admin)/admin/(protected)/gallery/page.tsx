"use client";

import { useEffect, useState } from "react";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { listGalleryImages } from "@/lib/firestore/gallery";
import type { GalleryImage } from "@/types/firestore";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listGalleryImages().then((images) => {
      setImages(images);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return <GalleryManager initialImages={images} />;
}
