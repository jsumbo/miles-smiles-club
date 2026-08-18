import { adminDb } from "@/lib/firebase/admin";
import type { GalleryImage } from "@/types/firestore";

const GALLERY = "gallery";

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const snap = await adminDb.collection(GALLERY).orderBy("order", "asc").get();
  return snap.docs.map((d) => d.data() as GalleryImage);
}

export async function createGalleryImage(input: Omit<GalleryImage, "id" | "createdAt">): Promise<string> {
  const ref = adminDb.collection(GALLERY).doc();
  const image: GalleryImage = { ...input, id: ref.id, createdAt: Date.now() };
  await ref.set(image);
  return ref.id;
}

export async function updateGalleryImage(
  id: string,
  input: Partial<Omit<GalleryImage, "id" | "createdAt">>
): Promise<void> {
  await adminDb.collection(GALLERY).doc(id).update(input);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await adminDb.collection(GALLERY).doc(id).delete();
}
