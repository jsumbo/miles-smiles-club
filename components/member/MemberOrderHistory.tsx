"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { MemberOrdersSkeleton } from "@/components/member/skeletons";
import { listMyOrdersAction } from "@/app/(dashboard)/account/actions";
import type { Order, OrderStatus } from "@/types/firestore";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-brand-secondary/10 text-brand-secondary",
  fulfilled: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-error/10 text-error",
};

export function MemberOrderHistory() {
  const { firebaseUser } = useMemberAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    firebaseUser.getIdToken().then((idToken) => {
      listMyOrdersAction(idToken).then(setOrders);
    });
  }, [firebaseUser]);

  if (!orders) return <MemberOrdersSkeleton />;

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <Package className="mx-auto h-6 w-6 text-text-muted" />
        <p className="mt-2 text-sm text-text-muted">No orders yet — check out the shop.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id} className="rounded-lg border border-border bg-surface-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                STATUS_STYLES[order.status]
              )}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <ul className="mt-2 space-y-0.5">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.variantId}`} className="text-sm text-text-muted">
                {item.quantity}× {item.productName}
                {item.variantLabel && ` (${item.variantLabel})`}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-semibold">${(order.totalCents / 100).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}
