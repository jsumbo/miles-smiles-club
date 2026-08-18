import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Matches the "title + Add button" row every manager page renders above its content. */
export function AdminPageActionsSkeleton() {
  return <Skeleton className="h-9 w-32 rounded-md" />;
}

/** Matches EventsManager / ProductsManager: a grid of image cards with a title, a couple lines, and a button. */
export function CardGridSkeleton({ count = 6, aspect = "video" }: { count?: number; aspect?: "video" | "square" }) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-card">
          <Skeleton className={cn("w-full rounded-none", aspect === "video" ? "aspect-video" : "aspect-square")} />
          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Matches GalleryManager: a grid of square thumbnails with a caption line. */
export function PhotoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border bg-surface-card shadow-card">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-2.5">
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Matches the stat-card rows on Orders / Sign ups / Members / Dashboard. */
export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface-card p-5 shadow-card">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="mt-3 h-3 w-20" />
          <Skeleton className="mt-2 h-8 w-14" />
        </div>
      ))}
    </div>
  );
}

/** Matches the Orders / Sign ups / Members tables. */
export function TableSkeleton({ rows = 6, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface-card">
      <table className="w-full min-w-240 text-sm">
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-3">
                  <Skeleton className="h-4 w-full max-w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
