import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Membership, Profile, Role } from "../types";

interface AuthValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  memberships: Membership[];
  membership: Membership | null;
  orgId: string | null;
  orgName: string;
  role: Role | null;
  isStaff: boolean;
  isManager: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  isClient: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitializing(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitializing(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setMemberships([]);
      setLoadedFor(null);
      return;
    }
    const [p, m] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("organization_memberships")
        .select("id, role, organization_id, organizations(id, name, slug)")
        .eq("user_id", userId),
    ]);
    setProfile((p.data as Profile | null) ?? null);
    setMemberships(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((m.data ?? []) as any[]).map((r) => {
        const org = Array.isArray(r.organizations) ? r.organizations[0] : r.organizations;
        return {
          id: r.id as string,
          role: r.role as Role,
          organization_id: r.organization_id as string,
          organization: (org ?? null) as Membership["organization"],
        };
      })
    );
    setLoadedFor(userId);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<AuthValue>(() => {
    const membership = memberships[0] ?? null;
    const role = membership?.role ?? null;
    return {
      loading: initializing || (userId !== null && loadedFor !== userId),
      session,
      user: session?.user ?? null,
      profile,
      memberships,
      membership,
      orgId: membership?.organization_id ?? null,
      orgName: membership?.organization?.name ?? "",
      role,
      isStaff: role !== null && role !== "client",
      isManager: role === "owner" || role === "admin" || role === "manager",
      isAdmin: role === "owner" || role === "admin",
      canEdit: role === "owner" || role === "admin" || role === "manager" || role === "developer",
      isClient: role === "client",
      refresh: load,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    };
  }, [initializing, userId, loadedFor, session, profile, memberships, load]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
