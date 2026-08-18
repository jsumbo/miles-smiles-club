"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { OrdersView } from "@/components/admin/OrdersView";
import { PageHeading } from "@/components/admin/PageHeading";
import { StatCardsSkeleton, TableSkeleton } from "@/components/admin/skeletons";
import { listOrdersAction } from "./actions";
import type { Order } from "@/types/firestore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listOrdersAction().then((orders) => {
      setOrders(orders);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div>
        <PageHeading icon={Package} title="Orders" />
        <StatCardsSkeleton count={3} />
        <TableSkeleton cols={7} />
      </div>
    );
  }

  return <OrdersView initialOrders={orders} />;
}
