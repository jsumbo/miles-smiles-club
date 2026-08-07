import { ensureSeeded, genId, readAll, writeAll } from "@/lib/firestore/store";
import type { GalleryImage } from "@/types/firestore";

const KEY = "gallery";

export async function listGalleryImages(): Promise<GalleryImage[]> {
  ensureSeeded();
  return readAll<GalleryImage>(KEY).sort((a, b) => a.order - b.order);
}

export async function createGalleryImage(input: Omit<GalleryImage, "id" | "createdAt">) {
  ensureSeeded();
  const images = readAll<GalleryImage>(KEY);
  const id = genId();
  images.push({ ...input, id, createdAt: Date.now() });
  writeAll(KEY, images);
  return id;
}

export async function updateGalleryImage(id: string, input: Partial<Omit<GalleryImage, "id" | "createdAt">>) {
  ensureSeeded();
  const images = readAll<GalleryImage>(KEY).map((img) => (img.id === id ? { ...img, ...input } : img));
  writeAll(KEY, images);
}

export async function deleteGalleryImage(id: string) {
  ensureSeeded();
  writeAll(KEY, readAll<GalleryImage>(KEY).filter((img) => img.id !== id));
}
