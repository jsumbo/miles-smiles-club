"use client";

import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CartProvider } from "@/components/cart/cart-context";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
