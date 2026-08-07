"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfettiBurst } from "@/components/public/ConfettiBurst";
import { useCart } from "@/components/cart/cart-context";
import { createOrder } from "@/lib/firestore/orders";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalCents, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPlacing(true);
    const fd = new FormData(e.currentTarget);

    await createOrder({
      customerName: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        variantId: i.variantId,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        priceCents: i.priceCents,
      })),
      totalCents,
      fulfillmentNote: (fd.get("note") as string) || "",
    });

    clear();
    setPlacing(false);
    setPlaced(true);
  }

  return (
    <>
      {items.length === 0 ? (
        <section className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
          <p className="font-heading text-2xl tracking-wide">Your cart is empty</p>
          <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline">
            ← Browse the shop
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-heading text-3xl tracking-wide sm:text-4xl">Your cart</h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="divide-y divide-border rounded-lg border border-border bg-surface-card">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {item.image && (
                        <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-text-muted">{item.variantLabel}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-primary">
                        ${(item.priceCents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between">
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-text-muted hover:text-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))
                          }
                          className="flex h-7 w-7 items-center justify-center text-text-muted hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-text-muted hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-text-muted">Total</span>
                <span className="font-heading text-lg">${(totalCents / 100).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 lg:col-span-2">
              <h2 className="font-heading text-lg tracking-wide">Checkout</h2>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Full name *</label>
                <input name="name" required className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Email *</label>
                <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Phone *</label>
                <input name="phone" required className={inputCls} placeholder="+231 77 000 0000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Note</label>
                <textarea name="note" rows={2} className={inputCls} placeholder="Pickup preference, etc." />
              </div>
              <Button type="submit" disabled={placing} className="w-full">
                {placing ? "Placing order…" : `Place order · $${(totalCents / 100).toFixed(2)}`}
              </Button>
              <p className="text-xs text-text-muted">
                Payment is arranged over WhatsApp after we confirm your order.
              </p>
            </form>
          </div>
        </section>
      )}

      <Dialog open={placed} onOpenChange={setPlaced}>
        <DialogContent className="overflow-hidden text-center sm:max-w-sm" showCloseButton={false}>
          <div className="relative py-4">
            <ConfettiBurst />
            <PartyPopper className="relative z-10 mx-auto h-10 w-10 text-brand-primary" />
            <h2 className="relative z-10 mt-4 font-heading text-xl tracking-wide">Order placed!</h2>
            <p className="relative z-10 mt-2 text-sm text-text-muted">
              We&apos;ll reach out to arrange pickup and payment.
            </p>
            <Link
              href="/shop"
              className="relative z-10 mt-5 inline-block w-full rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-card-hover"
            >
              Back to shop
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
