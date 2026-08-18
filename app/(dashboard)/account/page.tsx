"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Star, Package, ArrowRight } from "lucide-react";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatDateTime } from "@/lib/utils";
import { listMyRsvpEventIdsAction, listMyOrdersAction } from "./actions";
import { listUpcomingEventsAction } from "@/app/(public)/actions";
import type { RunEvent } from "@/types/firestore";

export default function AccountDashboardPage() {
  const { member, firebaseUser } = useMemberAuth();
  const [rsvpCount, setRsvpCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [nextRun, setNextRun] = useState<RunEvent | null | undefined>(undefined);

  useEffect(() => {
    if (!firebaseUser) return;
    firebaseUser.getIdToken().then((idToken) => {
      Promise.all([listMyRsvpEventIdsAction(idToken), listMyOrdersAction(idToken)]).then(
        ([rsvpEventIds, orders]) => {
          setRsvpCount(rsvpEventIds.length);
          setOrderCount(orders.length);
        }
      );
    });
    listUpcomingEventsAction(1).then((events) => setNextRun(events[0] ?? null));
  }, [firebaseUser]);

  if (!member) return null;

  const cards = [
    { label: "Runs", value: rsvpCount, icon: CalendarDays, href: "/account/runs" },
    { label: "Member since", display: formatDate(member.joinedAt), icon: Star, href: "/account/profile" },
    { label: "Products bought", value: orderCount, icon: Package, href: "/account/orders" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Welcome back, {member.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-text-muted">Here&apos;s what&apos;s going on with your membership.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-surface-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <card.icon className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-text-muted">{card.label}</p>
            {card.display !== undefined ? (
              <p className="mt-1 font-mono text-xl font-bold text-brand-primary">{card.display}</p>
            ) : card.value !== null ? (
              <p className="mt-1 font-mono text-3xl font-bold text-brand-primary">{card.value}</p>
            ) : (
              <Skeleton className="mt-2 h-8 w-14" />
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface-card p-5 shadow-card">
        <p className="text-xs uppercase tracking-widest text-text-muted">Next run</p>
        {nextRun === undefined ? (
          <Skeleton className="mt-3 h-14 w-full max-w-sm" />
        ) : nextRun ? (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading text-lg tracking-wide">{nextRun.title}</p>
              <p className="text-sm text-text-muted">{formatDateTime(nextRun.date, nextRun.time)}</p>
            </div>
            <Link
              href="/account/runs"
              className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
            >
              View &amp; RSVP <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-text-muted">No runs on the calendar yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}
