"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/public/ProductCard";
import { listProductsAction } from "@/app/(public)/actions";
import type { Product } from "@/types/firestore";

export function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listProductsAction({ activeOnly: true }).then((products) => {
      setProducts(products);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  if (products.length === 0) {
    return <p className="text-text-muted">Nothing in the shop yet — check back soon.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.id} href={`/shop/${product.slug}`}>
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  );
}
