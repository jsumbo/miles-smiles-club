"use client";

import type { LucideIcon } from "lucide-react";
import { UserPlus, Users, User, UserRound } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import type { JoinRequest } from "@/types/firestore";

const GENDER_LABELS: Record<string, string> = {
  female: "Female",
  male: "Male",
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-border bg-surface-card p-5 shadow-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-3xl font-bold text-brand-primary">{value}</p>
    </div>
  );
}

export function JoinRequestsView({ requests }: { requests: JoinRequest[] }) {
  const total = requests.length;

  const genderCounts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.gender] = (acc[r.gender] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeading icon={UserPlus} title="Sign ups" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total signups" value={total} icon={Users} />
        <StatCard label="Male" value={genderCounts.male ?? 0} icon={User} />
        <StatCard label="Female" value={genderCounts.female ?? 0} icon={UserRound} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface-card">
        <table className="w-full min-w-240 text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-widest text-text-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">WhatsApp</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Signed up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="p-3 font-medium">{request.name}</td>
                <td className="p-3">{request.email}</td>
                <td className="p-3">{request.whatsapp}</td>
                <td className="p-3 text-text-muted">{request.phone || "—"}</td>
                <td className="p-3">{GENDER_LABELS[request.gender] ?? request.gender}</td>
                <td className="p-3">{request.address}</td>
                <td className="p-3">{request.howHeard}</td>
                <td className="p-3 text-xs text-text-muted">{formatDate(request.createdAt)}</td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyState icon={UserPlus} title="No signups yet" description="They'll show up here as people join a run." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
