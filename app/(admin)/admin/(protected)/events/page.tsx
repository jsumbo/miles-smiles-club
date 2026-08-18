"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { EventsManager } from "@/components/admin/EventsManager";
import { PageHeading } from "@/components/admin/PageHeading";
import { AdminPageActionsSkeleton, CardGridSkeleton } from "@/components/admin/skeletons";
import { listEventsAction } from "./actions";
import type { RunEvent } from "@/types/firestore";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listEventsAction().then((events) => {
      setEvents(events);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageHeading icon={CalendarDays} title="Runs" />
          <AdminPageActionsSkeleton />
        </div>
        <CardGridSkeleton aspect="video" />
      </div>
    );
  }

  return <EventsManager initialEvents={events} />;
}
