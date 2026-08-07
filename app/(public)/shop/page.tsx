"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/public/ProductCard";
import { listProducts } from "@/lib/firestore/products";
import type { Product } from "@/types/firestore";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listProducts({ activeOnly: true }).then((products) => {
      setProducts(products);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Shop</p>
      <h1 className="mt-4 font-heading text-3xl tracking-wide sm:text-4xl lg:text-5xl">Club gear</h1>
      <p className="mt-4 max-w-2xl text-text-muted sm:text-lg">
        Tees, hats, and headwear to rep the club on and off the road.
      </p>

      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-muted">Nothing in the shop yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}
