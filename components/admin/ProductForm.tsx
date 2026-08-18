"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TagListInput } from "@/components/admin/TagListInput";

export interface ProductFormValues {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  images: string[];
  sizes: string[];
  colors: string[];
  active: boolean;
}

interface ProductFormProps {
  submitLabel: string;
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ submitLabel, initialValues, onSubmit }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.images?.[0] ?? "");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [sizes, setSizes] = useState(initialValues?.sizes ?? []);
  const [colors, setColors] = useState(initialValues?.colors ?? []);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    await onSubmit({
      name,
      slug: slug || slugify(name),
      description: fd.get("description") as string,
      priceCents: Math.round(Number(fd.get("price")) * 100),
      images: imageUrl ? [imageUrl] : [],
      sizes,
      colors,
      active: fd.get("active") === "on",
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Name *</label>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className={inputCls}
          placeholder="auto-generated from name"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Description</label>
        <textarea name="description" rows={3} defaultValue={initialValues?.description} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Price (USD) *</label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={initialValues?.priceCents ? (initialValues.priceCents / 100).toFixed(2) : undefined}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Photo</label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} folder="products" aspect="square" />
      </div>

      <TagListInput label="Sizes" placeholder="e.g. M" values={sizes} onChange={setSizes} />
      <TagListInput label="Colors" placeholder="e.g. Black" values={colors} onChange={setColors} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initialValues?.active ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Active (visible in the shop)
      </label>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
