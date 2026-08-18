"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { updateMemberProfileAction } from "@/app/(dashboard)/account/actions";
import { GENDERS } from "@/lib/formOptions";
import type { Gender } from "@/types/firestore";

export function ProfileForm() {
  const { member, firebaseUser, refresh } = useMemberAuth();
  const [loading, setLoading] = useState(false);

  if (!member || !firebaseUser) return null;

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const idToken = await firebaseUser!.getIdToken();
      const updated = await updateMemberProfileAction(idToken, {
        name: fd.get("name") as string,
        phone: fd.get("phone") as string,
        whatsapp: fd.get("whatsapp") as string,
        address: fd.get("address") as string,
        gender: fd.get("gender") as Gender,
      });
      if (updated) await refresh(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't save your profile. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-border bg-surface-card px-4 py-3 text-sm">
        <p>
          <span className="text-text-muted">Member No.</span>{" "}
          <span className="font-mono font-medium">{member.memberNumber}</span>
        </p>
        <p>
          <span className="text-text-muted">Member since</span>{" "}
          <span className="font-medium">{formatDate(member.joinedAt)}</span>
        </p>
        <p>
          <span className="text-text-muted">Email</span> <span className="font-medium">{member.email}</span>
        </p>
        {member.howHeard && (
          <p>
            <span className="text-text-muted">Heard about us via</span>{" "}
            <span className="font-medium">{member.howHeard}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="mb-1 block text-xs font-medium text-text-muted">
            Full name
          </label>
          <input id="profile-name" name="name" defaultValue={member.name} required className={inputCls} />
        </div>

        <div>
          <label htmlFor="profile-whatsapp" className="mb-1 block text-xs font-medium text-text-muted">
            WhatsApp number
          </label>
          <input id="profile-whatsapp" name="whatsapp" defaultValue={member.whatsapp} className={inputCls} />
        </div>

        <div>
          <label htmlFor="profile-phone" className="mb-1 block text-xs font-medium text-text-muted">
            Contact number (if different)
          </label>
          <input id="profile-phone" name="phone" defaultValue={member.phone} className={inputCls} />
        </div>

        <div>
          <label htmlFor="profile-address" className="mb-1 block text-xs font-medium text-text-muted">
            Address / Area
          </label>
          <input id="profile-address" name="address" defaultValue={member.address} className={inputCls} />
        </div>

        <div>
          <label htmlFor="profile-gender" className="mb-1 block text-xs font-medium text-text-muted">
            Gender
          </label>
          <select id="profile-gender" name="gender" defaultValue={member.gender} className={inputCls}>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
