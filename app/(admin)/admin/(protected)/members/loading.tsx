import { IdCard } from "lucide-react";
import { PageHeading } from "@/components/admin/PageHeading";
import { StatCardsSkeleton, TableSkeleton } from "@/components/admin/skeletons";

export default function AdminMembersLoading() {
  return (
    <div>
      <PageHeading icon={IdCard} title="Members" />
      <StatCardsSkeleton count={5} />
      <TableSkeleton cols={7} />
    </div>
  );
}
