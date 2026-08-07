import { ensureSeeded, genId, readAll, writeAll } from "@/lib/firestore/store";
import type { Order, OrderStatus } from "@/types/firestore";

const KEY = "orders";

export async function listOrders(): Promise<Order[]> {
  ensureSeeded();
  return readAll<Order>(KEY).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createOrder(input: Omit<Order, "id" | "createdAt" | "status">) {
  ensureSeeded();
  const orders = readAll<Order>(KEY);
  const id = genId();
  orders.push({ ...input, id, status: "pending", createdAt: Date.now() });
  writeAll(KEY, orders);
  return id;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  ensureSeeded();
  const orders = readAll<Order>(KEY).map((o) => (o.id === id ? { ...o, status } : o));
  writeAll(KEY, orders);
}
