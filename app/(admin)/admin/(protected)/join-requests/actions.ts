"use server";

import { requireAdminSession } from "@/lib/adminSession";
import { listJoinRequests } from "@/lib/firestore/joinRequests";

export async function listJoinRequestsAction() {
  await requireAdminSession();
  return listJoinRequests();
}
