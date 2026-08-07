"use client";

import { useEffect, useState } from "react";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/firestore/products";
import type { Product } from "@/types/firestore";

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listProducts().then((products) => {
      setProducts(products);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return <ProductsManager initialProducts={products} />;
}
