import { adminDb } from "@/lib/firebase/admin";
import type { Order, OrderStatus } from "@/types/firestore";

const ORDERS = "orders";

export async function listOrders(): Promise<Order[]> {
  const snap = await adminDb.collection(ORDERS).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as Order);
}

export async function listOrdersForMember(memberId: string): Promise<Order[]> {
  const snap = await adminDb.collection(ORDERS).where("memberId", "==", memberId).get();
  return snap.docs.map((d) => d.data() as Order).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createOrder(input: Omit<Order, "id" | "createdAt" | "status">): Promise<string> {
  const ref = adminDb.collection(ORDERS).doc();
  const order: Order = { ...input, id: ref.id, status: "pending", createdAt: Date.now() };
  await ref.set(order);
  return ref.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await adminDb.collection(ORDERS).doc(id).update({ status });
}
