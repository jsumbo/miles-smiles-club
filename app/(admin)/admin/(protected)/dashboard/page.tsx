"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, IdCard, Images, LayoutDashboard, Package, ShoppingBag, UserPlus } from "lucide-react";
import { PageHeading } from "@/components/admin/PageHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { listEventsAction } from "@/app/(admin)/admin/(protected)/events/actions";
import { listJoinRequestsAction } from "@/app/(admin)/admin/(protected)/join-requests/actions";
import { listProductsAction } from "@/app/(admin)/admin/(protected)/shop/actions";
import { listOrdersAction } from "@/app/(admin)/admin/(protected)/orders/actions";
import { listGalleryImagesAction } from "@/app/(admin)/admin/(protected)/gallery/actions";
import { listMembersAction } from "@/app/(admin)/admin/(protected)/members/actions";

const CARDS = [
  { key: "runs", label: "Upcoming runs", href: "/admin/events", icon: CalendarDays },
  { key: "joinRequests", label: "Sign ups", href: "/admin/join-requests", icon: UserPlus },
  { key: "members", label: "Members", href: "/admin/members", icon: IdCard },
  { key: "products", label: "Shop products", href: "/admin/shop", icon: ShoppingBag },
  { key: "orders", label: "Orders", href: "/admin/orders", icon: Package },
  { key: "gallery", label: "Gallery photos", href: "/admin/gallery", icon: Images },
] as const;

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      listEventsAction(),
      listJoinRequestsAction(),
      listProductsAction(),
      listOrdersAction(),
      listGalleryImagesAction(),
      listMembersAction(),
    ]).then(([events, joinRequests, products, orders, gallery, members]) => {
      setCounts({
        runs: events.filter((e) => e.date >= today).length,
        joinRequests: joinRequests.length,
        products: products.length,
        orders: orders.length,
        gallery: gallery.length,
        members: members.length,
      });
    });
  }, []);

  return (
    <div>
      <PageHeading icon={LayoutDashboard} title="Dashboard" />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-lg border border-border bg-surface-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <card.icon className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-text-muted">{card.label}</p>
            {counts ? (
              <p className="mt-1 font-mono text-3xl font-bold text-brand-primary">{counts[card.key]}</p>
            ) : (
              <Skeleton className="mt-2 h-8 w-14" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
