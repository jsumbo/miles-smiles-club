import { ensureSeeded, readAll } from "@/lib/firestore/store";
import type { JoinRequest } from "@/types/firestore";

const KEY = "join-requests";

export async function listJoinRequests(): Promise<JoinRequest[]> {
  ensureSeeded();
  return readAll<JoinRequest>(KEY).sort((a, b) => b.createdAt - a.createdAt);
}
