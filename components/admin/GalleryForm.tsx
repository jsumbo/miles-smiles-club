"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface GalleryFormValues {
  url: string;
  caption: string;
  order: number;
}

interface GalleryFormProps {
  submitLabel: string;
  initialValues?: Partial<GalleryFormValues>;
  onSubmit: (values: GalleryFormValues) => Promise<void>;
}

export function GalleryForm({ submitLabel, initialValues, onSubmit }: GalleryFormProps) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(initialValues?.url ?? "");

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await onSubmit({
      url,
      caption: (fd.get("caption") as string) || "",
      order: Number(fd.get("order")) || 0,
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Photo *</label>
        <ImageUpload value={url} onChange={setUrl} folder="gallery" aspect="square" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Caption</label>
        <input name="caption" defaultValue={initialValues?.caption} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Display order</label>
        <input name="order" type="number" defaultValue={initialValues?.order ?? 0} className={inputCls} />
      </div>
      <Button type="submit" disabled={loading || !url} className="w-full">
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
