"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  priceCents: number;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "miles-and-smiles-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          return prev.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prev, item];
      });
    };

    const removeItem = (productId: string, variantId: string) => {
      setItems((prev) =>
        prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
      );
    };

    const setQuantity = (productId: string, variantId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
        )
      );
    };

    const clear = () => setItems([]);

    const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    return { items, addItem, removeItem, setQuantity, clear, totalCents, totalQuantity };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
