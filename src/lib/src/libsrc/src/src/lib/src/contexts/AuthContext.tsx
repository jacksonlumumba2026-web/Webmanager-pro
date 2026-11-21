import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  profileError: string | null;
  loading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isRecovery: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Where Supabase sends people back to after a password reset email.
// BASE_URL is "/Webmanager-pro/" in the built site.
function getRedirectUrl(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

async function fetchProfile(
  userId: string
): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error: error.message };
  }
  return { profile: (data as Profile | null) ?? null, error: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileFor, setProfileFor] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isRecovery, setIsRecovery] = useState(false);

  const userId = session?.user.id;

  // 1. Watch the login session.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Keep this callback light: no Supabase calls inside it.
        setSession(newSession);
        setSessionReady(true);
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. Load the profile (role, organization) whenever the user changes.
  useEffect(() => {
    if (!sessionReady) return;

    if (!userId) {
      setProfile(null);
      setProfileFor(null);
      setProfileError(null);
      return;
    }

    let active = true;
    fetchProfile(userId).then((result) => {
      if (!active) return;
      setProfile(result.profile);
      setProfileError(result.error);
      setProfileFor(userId);
    });

    return () => {
      active = false;
    };
  }, [sessionReady, userId]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    const result = await fetchProfile(userId);
    setProfile(result.profile);
    setProfileError(result.error);
    setProfileFor(userId);
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getRedirectUrl(),
    });
    return error ? error.message : null;
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) setIsRecovery(false);
    return error ? error.message : null;
  }, []);

  const loading = !sessionReady || (Boolean(userId) && profileFor !== userId);

  const value = useMemo<AuthContextValue>(() => {
    const active = Boolean(profile?.is_active);
    return {
      session,
      user: session?.user ?? null,
      profile,
      profileError,
      loading,
      isAdmin: active && profile?.role === "admin",
      isClient: active && profile?.role === "client",
      isRecovery,
      signIn,
      signOut,
      sendPasswordReset,
      updatePassword,
      refreshProfile,
    };
  }, [
    session,
    profile,
    profileError,
    loading,
    isRecovery,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
