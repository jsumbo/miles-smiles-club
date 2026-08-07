"use client";

import { useEffect, useMemo, useState } from "react";
import { EventCard } from "@/components/public/EventCard";
import { JoinRunButton } from "@/components/public/JoinRunButton";
import { Button } from "@/components/ui/button";
import { getContentBlock } from "@/lib/firestore/content";
import { listEvents } from "@/lib/firestore/events";
import type { RunEvent } from "@/types/firestore";

const STRAVA_CLUB_URL = "https://www.strava.com/clubs/2075589";

const SCHEDULE_DEFAULTS = {
  heading: "How we run",
  body: "We run every Thursday as a core group, and open the roads to everyone on the 1st and 3rd Saturday of each month. No pressure, no pace requirement — just show up.",
};

const PAGE_SIZE = 6;

function EventSection({
  title,
  emptyLabel,
  events,
}: {
  title: string;
  emptyLabel: string;
  events: RunEvent[];
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
              <EventCard key={event.id} event={event} />
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

export default function RunsPage() {
  const [scheduleValue, setScheduleValue] = useState(SCHEDULE_DEFAULTS);
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getContentBlock("about-schedule"), listEvents()]).then(([schedule, events]) => {
      setScheduleValue({ ...SCHEDULE_DEFAULTS, ...schedule?.value });
      setEvents(events);
      setLoaded(true);
    });
  }, []);

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      upcoming: events.filter((e) => e.date >= today),
      past: events
        .filter((e) => e.date < today)
        .sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [events]);

  if (!loaded) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Runs</p>
      <h1 className="mt-4 font-heading text-3xl tracking-wide sm:text-4xl lg:text-5xl">
        {scheduleValue.heading}
      </h1>
      <p className="mt-4 max-w-2xl whitespace-pre-line text-text-muted sm:text-lg">
        {scheduleValue.body}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <JoinRunButton className="w-full rounded-md bg-brand-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover sm:w-auto">
          Join a run
        </JoinRunButton>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={STRAVA_CLUB_URL} target="_blank" rel="noreferrer" />}
        >
          <img src="/strava-logo-png-4.webp" alt="" className="h-4 w-4 object-contain" /> Follow us on Strava
        </Button>
      </div>

      <EventSection
        title="Upcoming runs"
        emptyLabel="Nothing on the calendar right now — check back soon, or ask in the group chat."
        events={upcoming}
      />

      <EventSection
        title="Past runs"
        emptyLabel="No past runs logged yet."
        events={past}
      />
    </section>
  );
}
