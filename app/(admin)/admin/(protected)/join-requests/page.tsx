"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { JoinRequestsView } from "@/components/admin/JoinRequestsView";
import { PageHeading } from "@/components/admin/PageHeading";
import { StatCardsSkeleton, TableSkeleton } from "@/components/admin/skeletons";
import { listJoinRequestsAction } from "./actions";
import type { JoinRequest } from "@/types/firestore";

export default function AdminJoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listJoinRequestsAction().then((requests) => {
      setRequests(requests);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div>
        <PageHeading icon={UserPlus} title="Sign ups" />
        <StatCardsSkeleton count={3} />
        <TableSkeleton cols={8} />
      </div>
    );
  }

  return <JoinRequestsView requests={requests} />;
}
