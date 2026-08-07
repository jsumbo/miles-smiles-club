"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MoreHorizontal, DollarSign, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/(admin)/admin/(protected)/shop/actions";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/firestore";

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [dialogTarget, setDialogTarget] = useState<"new" | Product | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading icon={ShoppingBag} title="Shop" />
        <Dialog open={dialogTarget === "new"} onOpenChange={(open) => setDialogTarget(open ? "new" : null)}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Add product</Button>} />
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New product</DialogTitle>
            </DialogHeader>
            <ProductForm
              submitLabel="Create product"
              onSubmit={async (values) => {
                const id = await createProductAction(values);
                setProducts((prev) => [...prev, { id, ...values, createdAt: Date.now() }]);
                setDialogTarget(null);
                toast.success("Product added");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isEditDialogOpen = dialogTarget !== "new" && dialogTarget?.id === product.id;

          return (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-card"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-heading text-text-muted/30">
                    {product.name.charAt(0)}
                  </div>
                )}
                <span
                  className={cn(
                    "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm",
                    product.active ? "bg-brand-secondary" : "bg-text-muted"
                  )}
                >
                  {product.active ? "Active" : "Hidden"}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Product actions"
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDialogTarget(product)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-error data-highlighted:text-error"
                      onClick={async () => {
                        if (!confirm(`Delete "${product.name}"?`)) return;
                        await deleteProductAction(product.id);
                        setProducts((prev) => prev.filter((p) => p.id !== product.id));
                        toast.success("Product deleted");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-5">
                <p className="font-heading text-xl tracking-wide">{product.name}</p>
                {product.description && (
                  <p className="mt-1 truncate text-sm text-text-muted">{product.description}</p>
                )}

                <div className="mt-4 space-y-2 text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 shrink-0 text-brand-primary" />
                    {(product.priceCents / 100).toFixed(2)}
                  </span>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={(open) => setDialogTarget(open ? product : null)}>
                  <DialogTrigger render={<Button className="mt-4 w-full">Manage</Button>} />
                  <DialogContent className="max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit product</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      submitLabel="Save changes"
                      initialValues={product}
                      onSubmit={async (values) => {
                        await updateProductAction(product.id, values);
                        setProducts((prev) =>
                          prev.map((p) => (p.id === product.id ? { ...p, ...values } : p))
                        );
                        setDialogTarget(null);
                        toast.success("Product updated");
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title="No products yet"
            description="Add the first one to start filling the shop."
          />
        )}
      </div>
    </div>
  );
}
