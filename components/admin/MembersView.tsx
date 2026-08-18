"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IdCard, Plus, Trash2, UserRoundCheck, Users, User, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PageHeading } from "@/components/admin/PageHeading";
import { EmptyState } from "@/components/admin/EmptyState";
import { formatDate, cn } from "@/lib/utils";
import { TIER_META } from "@/components/member/MembershipCard";
import { GENDERS } from "@/lib/formOptions";
import {
  createMemberInviteAction,
  deleteMemberInviteAction,
  setMemberStatusAction,
  setMemberTierAction,
} from "@/app/(admin)/admin/(protected)/members/actions";
import type { Member, MemberInvite, MemberStatus, MemberTier } from "@/types/firestore";

const TIER_OPTIONS: MemberTier[] = ["bronze", "silver", "gold"];
const GENDER_LABELS: Record<string, string> = { female: "Female", male: "Male" };

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-card p-5 shadow-card">
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
      )}
      <p className="mt-3 text-xs uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-3xl font-bold text-brand-primary">{value}</p>
    </div>
  );
}

export function MembersView({
  initialMembers,
  initialInvites,
}: {
  initialMembers: Member[];
  initialInvites: MemberInvite[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const active = members.filter((m) => m.status === "active").length;
  const genderCounts = members.reduce<Record<string, number>>((acc, m) => {
    acc[m.gender] = (acc[m.gender] ?? 0) + 1;
    return acc;
  }, {});

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function toggleStatus(member: Member) {
    const status: MemberStatus = member.status === "active" ? "inactive" : "active";
    await setMemberStatusAction(member.id, status);
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status } : m)));
    toast.success(status === "active" ? "Member reactivated" : "Member deactivated");
  }

  async function changeTier(member: Member, tier: MemberTier) {
    await setMemberTierAction(member.id, tier);
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, tier } : m)));
    toast.success(`Set to ${TIER_META[tier].label}`);
  }

  async function handleInviteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const joinedAtStr = fd.get("joinedAt") as string;

    const input = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      gender: (fd.get("gender") as Member["gender"]) || undefined,
      joinedAt: joinedAtStr ? new Date(joinedAtStr).getTime() : Date.now(),
      memberNumberOverride: (fd.get("memberNumber") as string) || undefined,
    };

    await createMemberInviteAction(input);
    setInvites((prev) => [
      { id: input.email.toLowerCase(), createdAt: Date.now(), ...input },
      ...prev,
    ]);
    setSubmitting(false);
    setInviteOpen(false);
    toast.success("Invite created");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading icon={IdCard} title="Members" />
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="h-4 w-4" /> Invite member
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label htmlFor="invite-name" className="mb-1 block text-xs font-medium text-text-muted">
                  Name
                </label>
                <input id="invite-name" name="name" required className={inputCls} />
              </div>
              <div>
                <label htmlFor="invite-email" className="mb-1 block text-xs font-medium text-text-muted">
                  Email
                </label>
                <input id="invite-email" name="email" type="email" required className={inputCls} />
              </div>
              <div>
                <label htmlFor="invite-gender" className="mb-1 block text-xs font-medium text-text-muted">
                  Gender
                </label>
                <select id="invite-gender" name="gender" className={inputCls}>
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="invite-joinedAt" className="mb-1 block text-xs font-medium text-text-muted">
                  Member since (optional — backdate if they joined before this)
                </label>
                <input id="invite-joinedAt" name="joinedAt" type="date" className={inputCls} />
              </div>
              <div>
                <label htmlFor="invite-memberNumber" className="mb-1 block text-xs font-medium text-text-muted">
                  Member number (optional override, e.g. MS-0001)
                </label>
                <input id="invite-memberNumber" name="memberNumber" className={inputCls} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Creating…" : "Create invite"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total members" value={members.length} icon={Users} />
        <StatCard label="Active" value={active} />
        <StatCard label="Pending invites" value={invites.length} />
        <StatCard label="Male" value={genderCounts.male ?? 0} icon={User} />
        <StatCard label="Female" value={genderCounts.female ?? 0} icon={UserRound} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface-card">
        <table className="w-full min-w-280 text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-widest text-text-muted">
            <tr>
              <th className="p-3 text-left">Member No.</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Member since</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Tier</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="p-3 font-mono text-xs">{member.memberNumber}</td>
                <td className="p-3 font-medium">{member.name}</td>
                <td className="p-3">{member.email}</td>
                <td className="p-3 text-text-muted">{formatDate(member.joinedAt)}</td>
                <td className="p-3">{GENDER_LABELS[member.gender] ?? member.gender}</td>
                <td className="p-3 text-text-muted">{member.howHeard || "—"}</td>
                <td className="p-3">
                  <Select
                    value={member.tier ?? "bronze"}
                    onValueChange={(value) => changeTier(member, value as MemberTier)}
                  >
                    <SelectTrigger className="w-32 rounded-md border border-border bg-surface-light px-2.5 py-1.5 text-xs">
                      <SelectValue>
                        {(value) => (TIER_META[value as MemberTier] ?? TIER_META.bronze).label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TIER_OPTIONS.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {TIER_META[tier].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      member.status === "active"
                        ? "bg-brand-secondary/10 text-brand-secondary"
                        : "bg-text-muted/10 text-text-muted"
                    )}
                  >
                    {member.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(member)}>
                    {member.status === "active" ? "Deactivate" : "Reactivate"}
                  </Button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={9} className="p-0">
                  <EmptyState
                    icon={UserRoundCheck}
                    title="No members yet"
                    description="Members appear here once they sign in for the first time."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {invites.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Pending invites</p>
          <ul className="mt-3 space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-card p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{invite.name}</p>
                  <p className="text-xs text-text-muted">
                    {invite.email} · member since {formatDate(invite.joinedAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Cancel invite"
                  onClick={async () => {
                    await deleteMemberInviteAction(invite.email);
                    setInvites((prev) => prev.filter((i) => i.id !== invite.id));
                    toast.success("Invite cancelled");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
