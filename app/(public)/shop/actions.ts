"use server";

import { adminAuth } from "@/lib/firebase/admin";
import { createOrder } from "@/lib/firestore/orders";
import type { Order } from "@/types/firestore";

type PlaceOrderInput = Omit<Order, "id" | "createdAt" | "status" | "memberId">;

export async function placeOrderAction(input: PlaceOrderInput, idToken?: string) {
  let memberId: string | undefined;
  if (idToken) {
    const decoded = await adminAuth.verifyIdToken(idToken);
    memberId = decoded.uid;
  }

  return createOrder({ ...input, ...(memberId ? { memberId } : {}) });
}
