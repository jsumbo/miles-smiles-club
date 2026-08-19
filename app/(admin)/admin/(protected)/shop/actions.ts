"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { listProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firestore/products";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export async function listProductsAction() {
  await requireAdminSession();
  return listProducts();
}

export async function createProductAction(values: ProductFormValues) {
  await requireAdminSession();
  const id = await createProduct(values);
  revalidatePath("/");
  return id;
}

export async function updateProductAction(id: string, values: Partial<ProductFormValues>) {
  await requireAdminSession();
  await updateProduct(id, values);
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  await requireAdminSession();
  await deleteProduct(id);
  revalidatePath("/");
}
