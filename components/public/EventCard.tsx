import Link from "next/link";
import { Flag, MapPin, Route, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RunEvent } from "@/types/firestore";

export interface EventRsvpState {
  signedIn: boolean;
  going: boolean;
  pending: boolean;
  onToggle: () => void;
}

export function EventCard({ event, rsvp }: { event: RunEvent; rsvp?: EventRsvpState }) {
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

        {rsvp && (
          <div className="mt-4 border-t border-border pt-4">
            {rsvp.signedIn ? (
              <button
                type="button"
                onClick={rsvp.onToggle}
                disabled={rsvp.pending}
                className={cn(
                  "flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
                  rsvp.going
                    ? "bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20"
                    : "bg-brand-primary text-white shadow-card hover:shadow-card-hover"
                )}
              >
                {rsvp.going && <Check className="h-4 w-4" />}
                {rsvp.pending ? "Saving…" : rsvp.going ? "You're going" : "RSVP"}
              </button>
            ) : (
              <Link
                href="/account/login"
                className="block w-full rounded-md border border-border px-4 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Sign in to RSVP
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
