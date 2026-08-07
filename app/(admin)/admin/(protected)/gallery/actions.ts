"use client";

import { createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firestore/gallery";
import type { GalleryFormValues } from "@/components/admin/GalleryForm";

export async function createGalleryImageAction(values: GalleryFormValues) {
  return createGalleryImage(values);
}

export async function updateGalleryImageAction(id: string, values: Partial<GalleryFormValues>) {
  return updateGalleryImage(id, values);
}

export async function deleteGalleryImageAction(id: string) {
  return deleteGalleryImage(id);
}
