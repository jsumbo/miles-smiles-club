"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useCart } from "@/components/cart/cart-context";
import { getProductAction } from "../../actions";
import type { Product } from "@/types/firestore";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductAction(slug).then((product) => {
      setProduct(product);
      setSize(product?.sizes[0] ?? null);
      setColor(product?.colors[0] ?? null);
    });
  }, [slug]);

  if (product === undefined) return null;

  if (product === null) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p className="font-heading text-2xl tracking-wide">Product not found</p>
        <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline">
          ← Back to shop
        </Link>
      </section>
    );
  }

  const price = (product.priceCents / 100).toFixed(2);
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const canAdd = (!needsSize || Boolean(size)) && (!needsColor || Boolean(color));
  const variantLabel = [size, color].filter(Boolean).join(" / ");

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/shop" className="text-sm font-semibold text-brand-primary hover:underline">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl font-heading text-text-muted/30">
              {product.name.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-heading text-2xl tracking-wide sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-brand-primary">${price}</p>
          <p className="mt-4 text-sm text-text-muted">{product.description}</p>

          {needsSize && (
            <div className="mt-6">
              <label className="mb-1 block text-xs font-medium text-text-muted">Size</label>
              <Select value={size} onValueChange={(value) => setSize(value as string)}>
                <SelectTrigger className="w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm sm:w-48">
                  <SelectValue placeholder="Choose a size">{(value) => value as string}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {needsColor && (
            <div className="mt-5">
              <label className="mb-1 block text-xs font-medium text-text-muted">Color</label>
              <Select value={color} onValueChange={(value) => setColor(value as string)}>
                <SelectTrigger className="w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm sm:w-48">
                  <SelectValue placeholder="Choose a color">{(value) => value as string}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mt-5">
            <label className="mb-1 block text-xs font-medium text-text-muted">Quantity</label>
            <div className="flex w-32 items-center gap-1 rounded-md border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center text-text-muted hover:text-foreground"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="flex h-9 w-9 items-center justify-center text-text-muted hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <Button
            className="mt-6 w-full sm:w-auto"
            disabled={!canAdd}
            onClick={() => {
              addItem({
                productId: product.id,
                productName: product.name,
                variantId: variantLabel || "default",
                variantLabel,
                priceCents: product.priceCents,
                quantity,
                image: product.images[0],
              });
              toast.success(`Added ${product.name} to cart`);
              router.push("/shop/cart");
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
