"use client";

import { useEffect, useState } from "react";
import { OrdersView } from "@/components/admin/OrdersView";
import { listOrders } from "@/lib/firestore/orders";
import type { Order } from "@/types/firestore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listOrders().then((orders) => {
      setOrders(orders);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return <OrdersView initialOrders={orders} />;
}
