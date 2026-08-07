import type { GalleryImage } from "@/types/firestore";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-secondary"
        >
          <img
            src={img.url}
            alt={img.caption || "Run club photo"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {img.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-xs text-white">{img.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
