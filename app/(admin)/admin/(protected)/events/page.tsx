"use client";

import { useEffect, useState } from "react";
import { EventsManager } from "@/components/admin/EventsManager";
import { listEvents } from "@/lib/firestore/events";
import type { RunEvent } from "@/types/firestore";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listEvents().then((events) => {
      setEvents(events);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return <EventsManager initialEvents={events} />;
}
