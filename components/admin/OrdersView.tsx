"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Package, Clock, DollarSign } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import { updateOrderStatusAction } from "@/app/(admin)/admin/(protected)/orders/actions";
import { formatDate } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Order, OrderStatus } from "@/types/firestore";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label])) as Record<
  OrderStatus,
  string
>;

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-border bg-surface-card p-5 shadow-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-3xl font-bold text-brand-primary">{value}</p>
    </div>
  );
}

export function OrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const revenueCents = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <div>
      <PageHeading icon={Package} title="Orders" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={String(total)} icon={Package} />
        <StatCard label="Pending" value={String(pending)} icon={Clock} />
        <StatCard label="Revenue" value={`$${(revenueCents / 100).toFixed(2)}`} icon={DollarSign} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface-card">
        <table className="w-full min-w-240 text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-widest text-text-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-3 font-medium">{order.customerName}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3 text-text-muted">{order.phone}</td>
                <td className="p-3">
                  <ul className="space-y-0.5">
                    {order.items.map((item) => (
                      <li key={`${item.productId}-${item.variantId}`} className="text-xs">
                        {item.quantity}× {item.productName}
                        {item.variantLabel && ` (${item.variantLabel})`}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 font-medium">${(order.totalCents / 100).toFixed(2)}</td>
                <td className="p-3">
                  <Select
                    value={order.status}
                    onValueChange={async (value) => {
                      const status = value as OrderStatus;
                      await updateOrderStatusAction(order.id, status);
                      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
                      toast.success("Order updated");
                    }}
                  >
                    <SelectTrigger className="w-36 rounded-md border border-border bg-surface-light px-2.5 py-1.5 text-xs">
                      <SelectValue>{(value) => STATUS_LABELS[value as OrderStatus]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-xs text-text-muted">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-0">
                  <EmptyState icon={Package} title="No orders yet" description="They'll show up here once someone checks out." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
