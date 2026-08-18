import { MembersView } from "@/components/admin/MembersView";
import { listMembers, listMemberInvites } from "@/lib/firestore/members";

// Admin data — always render fresh per-request, never freeze into the build.
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const [members, invites] = await Promise.all([listMembers(), listMemberInvites()]);

  return <MembersView initialMembers={members} initialInvites={invites} />;
}
