"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  updateGalleryImageAction,
} from "@/app/(admin)/admin/(protected)/gallery/actions";
import type { GalleryImage } from "@/types/firestore";

export function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [dialogTarget, setDialogTarget] = useState<"new" | GalleryImage | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading icon={Images} title="Gallery" />
        <Dialog open={dialogTarget === "new"} onOpenChange={(open) => setDialogTarget(open ? "new" : null)}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Add photo</Button>} />
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New photo</DialogTitle>
            </DialogHeader>
            <GalleryForm
              submitLabel="Add photo"
              onSubmit={async (values) => {
                const id = await createGalleryImageAction(values);
                setImages((prev) => [...prev, { id, ...values, createdAt: Date.now() }].sort((a, b) => a.order - b.order));
                setDialogTarget(null);
                toast.success("Photo added");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-lg border border-border bg-surface-card shadow-card">
            <div className="aspect-square w-full overflow-hidden bg-secondary">
              <img src={image.url} alt={image.caption || "Gallery photo"} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2 p-2.5">
              <p className="min-w-0 flex-1 truncate text-xs text-text-muted">{image.caption || "—"}</p>
              <div className="flex shrink-0 gap-1">
                <Dialog
                  open={dialogTarget !== "new" && dialogTarget?.id === image.id}
                  onOpenChange={(open) => setDialogTarget(open ? image : null)}
                >
                  <DialogTrigger
                    render={
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <DialogContent className="max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit photo</DialogTitle>
                    </DialogHeader>
                    <GalleryForm
                      submitLabel="Save changes"
                      initialValues={image}
                      onSubmit={async (values) => {
                        await updateGalleryImageAction(image.id, values);
                        setImages((prev) =>
                          prev
                            .map((img) => (img.id === image.id ? { ...img, ...values } : img))
                            .sort((a, b) => a.order - b.order)
                        );
                        setDialogTarget(null);
                        toast.success("Photo updated");
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={async () => {
                    if (!confirm("Delete this photo?")) return;
                    await deleteGalleryImageAction(image.id);
                    setImages((prev) => prev.filter((img) => img.id !== image.id));
                    toast.success("Photo deleted");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-error" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <EmptyState
            icon={Images}
            title="No photos yet"
            description="Add the first one to start building the gallery."
          />
        )}
      </div>
    </div>
  );
}
