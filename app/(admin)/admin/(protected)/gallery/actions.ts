"use server";

import { requireAdminSession } from "@/lib/adminSession";
import { listGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firestore/gallery";
import type { GalleryFormValues } from "@/components/admin/GalleryForm";

export async function listGalleryImagesAction() {
  await requireAdminSession();
  return listGalleryImages();
}

export async function createGalleryImageAction(values: GalleryFormValues) {
  await requireAdminSession();
  return createGalleryImage(values);
}

export async function updateGalleryImageAction(id: string, values: Partial<GalleryFormValues>) {
  await requireAdminSession();
  return updateGalleryImage(id, values);
}

export async function deleteGalleryImageAction(id: string) {
  await requireAdminSession();
  return deleteGalleryImage(id);
}
