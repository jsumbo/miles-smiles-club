"use server";

import { requireAdminSession } from "@/lib/adminSession";
import { listOrders, updateOrderStatus } from "@/lib/firestore/orders";
import type { OrderStatus } from "@/types/firestore";

export async function listOrdersAction() {
  await requireAdminSession();
  return listOrders();
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdminSession();
  return updateOrderStatus(id, status);
}
