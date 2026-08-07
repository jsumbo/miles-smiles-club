import type { Product } from "@/types/firestore";

export function ProductCard({ product }: { product: Product }) {
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <div className="group rounded-lg border border-border bg-surface-card shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-secondary">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-heading text-text-muted/30">
            {product.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-heading text-sm tracking-wide">{product.name}</h3>
        <p className="mt-1 text-xs text-text-muted line-clamp-2">{product.description}</p>
        <p className="mt-2 text-sm font-semibold text-brand-primary">${price}</p>
      </div>
    </div>
  );
}
