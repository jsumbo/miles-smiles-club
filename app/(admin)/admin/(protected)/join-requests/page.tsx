"use client";

import { useEffect, useState } from "react";
import { JoinRequestsView } from "@/components/admin/JoinRequestsView";
import { listJoinRequests } from "@/lib/firestore/joinRequests";
import type { JoinRequest } from "@/types/firestore";

export default function AdminJoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listJoinRequests().then((requests) => {
      setRequests(requests);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return <JoinRequestsView requests={requests} />;
}
