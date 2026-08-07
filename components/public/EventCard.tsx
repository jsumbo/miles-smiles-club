import { Flag, MapPin, Route } from "lucide-react";
import type { RunEvent } from "@/types/firestore";

export function EventCard({ event }: { event: RunEvent }) {
  const date = new Date(`${event.date}T${event.time || "00:00"}`);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-card shadow-card transition-shadow hover:shadow-card-hover">
      <div className="aspect-video w-full overflow-hidden bg-secondary">
        <img
          src={event.imageUrl || "/run-placeholder.jpeg"}
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
          {formatted} {event.time && `· ${event.time}`}
        </p>
        <h3 className="mt-2 font-heading text-xl tracking-wide">{event.title}</h3>
        <p className="mt-2 text-sm text-text-muted">{event.description}</p>
        <div className="mt-4 flex flex-col gap-2 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-brand-secondary" />
            <span className="font-medium text-foreground">Start:</span> {event.startPoint}
          </span>
          <span className="flex items-center gap-1.5">
            <Flag className="h-4 w-4 shrink-0 text-brand-primary" />
            <span className="font-medium text-foreground">End:</span> {event.endPoint}
          </span>
          <span className="flex items-center gap-1.5">
            <Route className="h-4 w-4 text-brand-secondary" /> {event.distanceKm} km
          </span>
        </div>
      </div>
    </div>
  );
}
