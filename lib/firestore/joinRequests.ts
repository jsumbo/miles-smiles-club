import { adminDb } from "@/lib/firebase/admin";
import type { JoinRequest } from "@/types/firestore";

const JOIN_REQUESTS = "join-requests";

export async function listJoinRequests(): Promise<JoinRequest[]> {
  const snap = await adminDb.collection(JOIN_REQUESTS).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as JoinRequest);
}

export async function createJoinRequest(input: Omit<JoinRequest, "id" | "createdAt">): Promise<string> {
  const ref = adminDb.collection(JOIN_REQUESTS).doc();
  const request: JoinRequest = { ...input, id: ref.id, createdAt: Date.now() };
  await ref.set(request);
  return ref.id;
}
