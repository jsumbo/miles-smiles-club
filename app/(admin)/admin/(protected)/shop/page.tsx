"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { PageHeading } from "@/components/admin/PageHeading";
import { AdminPageActionsSkeleton, CardGridSkeleton } from "@/components/admin/skeletons";
import { listProductsAction } from "./actions";
import type { Product } from "@/types/firestore";

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listProductsAction().then((products) => {
      setProducts(products);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeading icon={ShoppingBag} title="Shop" />
          <AdminPageActionsSkeleton />
        </div>
        <CardGridSkeleton aspect="square" />
      </div>
    );
  }

  return <ProductsManager initialProducts={products} />;
}
