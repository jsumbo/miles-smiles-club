"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { AccountMenu } from "@/components/public/AccountMenu";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/runs", label: "Runs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-light/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
          <img src="/logo.jpg" alt="Miles & Smiles Run Club" className="h-10 w-10 rounded-lg object-cover sm:h-11 sm:w-11" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-text-muted transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/shop/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            aria-label="View cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
          <AccountMenu />
          <Link
            href="/shop"
            className="hidden rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover sm:inline-block"
          >
            Shop
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface-light px-4 py-4 sm:px-6 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === link.href && "bg-secondary text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/shop"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block w-full rounded-md bg-brand-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-card"
          >
            Shop
          </Link>
        </div>
      )}
    </header>
  );
}
