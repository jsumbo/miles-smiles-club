"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { updateMemberProfileAction } from "@/app/(dashboard)/account/actions";
import { MembershipCard } from "@/components/member/MembershipCard";
import { CardThemePicker } from "@/components/member/CardThemePicker";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { CardTheme, Member } from "@/types/firestore";

export function CardEditor() {
  const { member, firebaseUser, refresh } = useMemberAuth();
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl ?? "");
  const [cardTheme, setCardTheme] = useState<CardTheme>(member?.cardTheme ?? "classic");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!member || !firebaseUser) return null;

  const preview: Member = { ...member, photoUrl, cardTheme };
  const dirty = photoUrl !== member.photoUrl || cardTheme !== member.cardTheme;

  async function handleSave() {
    setSaving(true);
    try {
      const idToken = await firebaseUser!.getIdToken();
      const updated = await updateMemberProfileAction(idToken, { photoUrl, cardTheme });
      if (updated) await refresh(updated);
      toast.success("Card updated");
    } catch {
      toast.error("Couldn't save your card. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const idToken = await firebaseUser!.getIdToken();
      const res = await fetch("/api/account/card-image", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${member!.memberNumber}-membership-card.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't download your card. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
      <MembershipCard member={preview} />

      <div className="space-y-6">
        <div>
          <p className="mb-2 text-xs font-medium text-text-muted">Photo</p>
          <ImageUpload
            value={photoUrl}
            onChange={setPhotoUrl}
            folder="members"
            aspect="square"
            getIdToken={() => firebaseUser!.getIdToken()}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-text-muted">Card theme</p>
          <CardThemePicker value={cardTheme} onChange={setCardTheme} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save card"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Preparing…" : "Download card"}
          </button>
        </div>

        {dirty && (
          <p className="text-xs text-text-muted">Save your changes first to include them in the download.</p>
        )}
      </div>
    </div>
  );
}
