"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MoreHorizontal, CalendarDays, MapPin, Flag, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
} from "@/app/(admin)/admin/(protected)/events/actions";
import { cn, formatDateTime } from "@/lib/utils";
import type { RunEvent } from "@/types/firestore";

export function EventsManager({ initialEvents }: { initialEvents: RunEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [dialogTarget, setDialogTarget] = useState<"new" | RunEvent | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading icon={CalendarDays} title="Runs" />
        <Dialog open={dialogTarget === "new"} onOpenChange={(open) => setDialogTarget(open ? "new" : null)}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Add run</Button>} />
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New run</DialogTitle>
            </DialogHeader>
            <EventForm
              submitLabel="Create run"
              onSubmit={async (values) => {
                const id = await createEventAction(values);
                setEvents((prev) => [...prev, { id, ...values, createdAt: Date.now() }]);
                setDialogTarget(null);
                toast.success("Run added");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const upcoming = event.date >= today;
          const isEditDialogOpen = dialogTarget !== "new" && dialogTarget?.id === event.id;

          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-card"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                <img
                  src={event.imageUrl || "/run-placeholder.jpeg"}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <span
                  className={cn(
                    "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm",
                    upcoming ? "bg-brand-secondary" : "bg-text-muted"
                  )}
                >
                  {upcoming ? "Upcoming" : "Past"}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Run actions"
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDialogTarget(event)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-error data-highlighted:text-error"
                      onClick={async () => {
                        if (!confirm(`Delete "${event.title}"?`)) return;
                        await deleteEventAction(event.id);
                        setEvents((prev) => prev.filter((e) => e.id !== event.id));
                        toast.success("Run deleted");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-5">
                <p className="font-heading text-xl tracking-wide">{event.title}</p>
                {event.description && (
                  <p className="mt-1 truncate text-sm text-text-muted">{event.description}</p>
                )}

                <div className="mt-4 space-y-2 text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-brand-primary" />
                    {formatDateTime(event.date, event.time)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-secondary" />
                    <span className="truncate">{event.startPoint}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Flag className="h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="truncate">{event.endPoint}</span>
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <Route className="h-4 w-4 text-text-muted" />
                  <span className="font-semibold">{event.distanceKm} km</span>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={(open) => setDialogTarget(open ? event : null)}>
                  <DialogTrigger
                    render={
                      <Button className="mt-4 w-full">Manage</Button>
                    }
                  />
                  <DialogContent className="max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit run</DialogTitle>
                    </DialogHeader>
                    <EventForm
                      submitLabel="Save changes"
                      initialValues={event}
                      onSubmit={async (values) => {
                        await updateEventAction(event.id, values);
                        setEvents((prev) =>
                          prev.map((e) => (e.id === event.id ? { ...e, ...values } : e))
                        );
                        setDialogTarget(null);
                        toast.success("Run updated");
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            title="No runs yet"
            description="Add the first one to get it on the calendar."
          />
        )}
      </div>
    </div>
  );
}
