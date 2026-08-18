"use client";

import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { PageHeading } from "@/components/admin/PageHeading";
import { AdminPageActionsSkeleton, PhotoGridSkeleton } from "@/components/admin/skeletons";
import { listGalleryImagesAction } from "./actions";
import type { GalleryImage } from "@/types/firestore";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listGalleryImagesAction().then((images) => {
      setImages(images);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeading icon={Images} title="Gallery" />
          <AdminPageActionsSkeleton />
        </div>
        <PhotoGridSkeleton />
      </div>
    );
  }

  return <GalleryManager initialImages={images} />;
}
