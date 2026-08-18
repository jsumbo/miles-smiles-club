import { adminDb } from "@/lib/firebase/admin";
import type { ContentBlock } from "@/types/firestore";

const CONTENT = "content";

export async function getContentBlock(id: string): Promise<ContentBlock | null> {
  const snap = await adminDb.collection(CONTENT).doc(id).get();
  return snap.exists ? (snap.data() as ContentBlock) : null;
}
