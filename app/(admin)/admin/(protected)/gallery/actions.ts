"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { listGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/firestore/gallery";
import type { GalleryFormValues } from "@/components/admin/GalleryForm";

export async function listGalleryImagesAction() {
  await requireAdminSession();
  return listGalleryImages();
}

export async function createGalleryImageAction(values: GalleryFormValues) {
  await requireAdminSession();
  const id = await createGalleryImage(values);
  revalidatePath("/");
  return id;
}

export async function updateGalleryImageAction(id: string, values: Partial<GalleryFormValues>) {
  await requireAdminSession();
  await updateGalleryImage(id, values);
  revalidatePath("/");
}

export async function deleteGalleryImageAction(id: string) {
  await requireAdminSession();
  await deleteGalleryImage(id);
  revalidatePath("/");
}
