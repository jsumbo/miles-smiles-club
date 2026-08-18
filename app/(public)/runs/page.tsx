"use client";

import { useEffect, useState } from "react";
import { RunsList } from "@/components/public/RunsList";
import { JoinRunButton } from "@/components/public/JoinRunButton";
import { Button } from "@/components/ui/button";
import { getContentBlockAction } from "../actions";

const STRAVA_CLUB_URL = "https://www.strava.com/clubs/2075589";

const SCHEDULE_DEFAULTS = {
  heading: "How we run",
  body: "We run every Thursday as a core group, and open the roads to everyone on the 1st and 3rd Saturday of each month. No pressure, no pace requirement — just show up.",
};

export default function RunsPage() {
  const [scheduleValue, setScheduleValue] = useState(SCHEDULE_DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getContentBlockAction("about-schedule").then((schedule) => {
      setScheduleValue({ ...SCHEDULE_DEFAULTS, ...schedule?.value });
      setLoaded(true);
    });
  }, []);

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

      <RunsList />
    </section>
  );
}
