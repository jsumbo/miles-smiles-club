"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { subscribeAuthState, signOutMember } from "@/lib/firebase/memberAuth";
import { getOrProvisionMemberAction } from "@/app/(dashboard)/account/actions";
import type { Member } from "@/types/firestore";

interface MemberAuthContextValue {
  firebaseUser: User | null;
  member: Member | null;
  loading: boolean;
  refresh: (updated?: Member) => Promise<void>;
  signOut: () => Promise<void>;
}

const MemberAuthContext = createContext<MemberAuthContextValue | null>(null);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuthState(async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setMember(null);
        setLoading(false);
        return;
      }
      const idToken = await user.getIdToken();
      const provisioned = await getOrProvisionMemberAction(idToken);
      setMember(provisioned);
      setLoading(false);
    });
  }, []);

  const value = useMemo<MemberAuthContextValue>(() => {
    const refresh = async (updated?: Member) => {
      if (updated) {
        setMember(updated);
        return;
      }
      if (!firebaseUser) return;
      const idToken = await firebaseUser.getIdToken();
      const provisioned = await getOrProvisionMemberAction(idToken);
      setMember(provisioned);
    };

    const signOut = async () => {
      await signOutMember();
      setMember(null);
    };

    return { firebaseUser, member, loading, refresh, signOut };
  }, [firebaseUser, member, loading]);

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useMemberAuth() {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) throw new Error("useMemberAuth must be used within a MemberAuthProvider");
  return ctx;
}
