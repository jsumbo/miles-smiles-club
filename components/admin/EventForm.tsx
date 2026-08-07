"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface EventFormValues {
  title: string;
  date: string;
  time: string;
  startPoint: string;
  endPoint: string;
  distanceKm: number;
  description: string;
  imageUrl: string;
}

interface EventFormProps {
  submitLabel: string;
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
}

export function EventForm({ submitLabel, initialValues, onSubmit }: EventFormProps) {
  const isEditing = Boolean(initialValues);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    initialValues?.imageUrl || (isEditing ? "/run-placeholder.jpeg" : "")
  );

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await onSubmit({
      title: fd.get("title") as string,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      startPoint: fd.get("startPoint") as string,
      endPoint: fd.get("endPoint") as string,
      distanceKm: Number(fd.get("distanceKm")),
      description: fd.get("description") as string,
      imageUrl,
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Title *</label>
        <input name="title" required defaultValue={initialValues?.title} className={inputCls} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Date *</label>
          <input name="date" type="date" required defaultValue={initialValues?.date} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Time *</label>
          <input name="time" type="time" required defaultValue={initialValues?.time} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Start point *</label>
          <input
            name="startPoint"
            required
            defaultValue={initialValues?.startPoint}
            className={inputCls}
            placeholder="Monrovia"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">End point *</label>
          <input
            name="endPoint"
            required
            defaultValue={initialValues?.endPoint}
            className={inputCls}
            placeholder="Meet point shared closer to the day"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Distance (km) *</label>
        <input name="distanceKm" type="number" step="0.1" min="0" required defaultValue={initialValues?.distanceKm} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Description</label>
        <textarea name="description" rows={3} defaultValue={initialValues?.description} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Photo</label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} aspect="video" />
        <p className="mt-1 text-xs text-text-muted">
          {isEditing ? "Replace to change the run's photo." : "Leave blank to use the default run photo."}
        </p>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
