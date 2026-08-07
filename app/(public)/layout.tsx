"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartProvider } from "@/components/cart/cart-context";
import { ensureSeeded } from "@/lib/firestore/store";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureSeeded();
  }, []);

  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
