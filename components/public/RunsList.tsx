"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EventCard, type EventRsvpState } from "@/components/public/EventCard";
import { Button } from "@/components/ui/button";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { listEventsAction } from "@/app/(public)/actions";
import { listMyRsvpEventIdsAction, toggleRsvpAction } from "@/app/(dashboard)/account/actions";
import type { RunEvent } from "@/types/firestore";

const PAGE_SIZE = 6;

function EventSection({
  title,
  emptyLabel,
  events,
  getRsvp,
}: {
  title: string;
  emptyLabel: string;
  events: RunEvent[];
  getRsvp?: (event: RunEvent) => EventRsvpState;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? events : events.slice(0, PAGE_SIZE);

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="font-heading text-xl tracking-wide sm:text-2xl">{title}</h2>
      {events.length > 0 ? (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visible.map((event) => (
              <EventCard key={event.id} event={event} rsvp={getRsvp?.(event)} />
            ))}
          </div>
          {!showAll && events.length > PAGE_SIZE && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => setShowAll(true)}>
                View all ({events.length})
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-6 text-text-muted">{emptyLabel}</p>
      )}
    </div>
  );
}

/** Upcoming/past run lists with RSVP, shared by the public /runs page and the member dashboard's /account/runs page. */
export function RunsList() {
  const { firebaseUser } = useMemberAuth();
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [rsvpEventIds, setRsvpEventIds] = useState<Set<string>>(new Set());
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listEventsAction().then((events) => {
      setEvents(events);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setRsvpEventIds(new Set());
      return;
    }
    firebaseUser.getIdToken().then((idToken) => {
      listMyRsvpEventIdsAction(idToken).then((ids) => setRsvpEventIds(new Set(ids)));
    });
  }, [firebaseUser]);

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      upcoming: events.filter((e) => e.date >= today),
      past: events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [events]);

  async function handleToggle(eventId: string) {
    if (!firebaseUser) return;
    setPendingEventId(eventId);
    try {
      const idToken = await firebaseUser.getIdToken();
      const going = await toggleRsvpAction(idToken, eventId);
      setRsvpEventIds((prev) => {
        const next = new Set(prev);
        if (going) next.add(eventId);
        else next.delete(eventId);
        return next;
      });
      toast.success(going ? "You're on the list" : "RSVP removed");
    } catch {
      toast.error("Couldn't update your RSVP. Try again.");
    } finally {
      setPendingEventId(null);
    }
  }

  if (!loaded) return null;

  const getRsvp = (event: RunEvent): EventRsvpState => ({
    signedIn: Boolean(firebaseUser),
    going: rsvpEventIds.has(event.id),
    pending: pendingEventId === event.id,
    onToggle: () => handleToggle(event.id),
  });

  return (
    <>
      <EventSection
        title="Upcoming runs"
        emptyLabel="Nothing on the calendar right now — check back soon, or ask in the group chat."
        events={upcoming}
        getRsvp={getRsvp}
      />

      <EventSection title="Past runs" emptyLabel="No past runs logged yet." events={past} />
    </>
  );
}
