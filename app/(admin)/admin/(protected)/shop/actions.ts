"use server";

import { requireAdminSession } from "@/lib/adminSession";
import { listProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firestore/products";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export async function listProductsAction() {
  await requireAdminSession();
  return listProducts();
}

export async function createProductAction(values: ProductFormValues) {
  await requireAdminSession();
  return createProduct(values);
}

export async function updateProductAction(id: string, values: Partial<ProductFormValues>) {
  await requireAdminSession();
  return updateProduct(id, values);
}

export async function deleteProductAction(id: string) {
  await requireAdminSession();
  return deleteProduct(id);
}
