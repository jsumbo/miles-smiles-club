"use client";

import { createProduct, updateProduct, deleteProduct } from "@/lib/firestore/products";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export async function createProductAction(values: ProductFormValues) {
  return createProduct(values);
}

export async function updateProductAction(id: string, values: Partial<ProductFormValues>) {
  return updateProduct(id, values);
}

export async function deleteProductAction(id: string) {
  return deleteProduct(id);
}
