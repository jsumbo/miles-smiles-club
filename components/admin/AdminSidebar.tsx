"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, UserPlus, LayoutDashboard, ShoppingBag, Images, Package, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Runs", icon: CalendarDays },
  { href: "/admin/shop", label: "Shop", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/members", label: "Members", icon: IdCard },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/join-requests", label: "Sign Ups", icon: UserPlus },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-border bg-surface-card">
      <div className="px-4 py-5">
        <Link href="/" className="font-heading text-lg tracking-wide" onClick={onNavigate}>
          Miles<span className="text-brand-primary">&</span>Smiles
        </Link>
        <p className="mt-0.5 text-[10px] uppercase tracking-widest text-text-muted">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-text-muted hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
