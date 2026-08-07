import { readRecord } from "@/lib/firestore/store";
import type { ContentBlock } from "@/types/firestore";

export async function getContentBlock(id: string): Promise<ContentBlock | null> {
  const all = readRecord<ContentBlock>("content");
  return all[id] ?? null;
}
