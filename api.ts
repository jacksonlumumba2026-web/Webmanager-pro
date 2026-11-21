import { supabase } from "./supabase";

export function errMsg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return "Something went wrong. Try again.";
}

export async function logActivity(p: {
  orgId: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabase.from("activity_logs").insert({
      organization_id: p.orgId,
      actor_user_id: p.userId,
      action: p.action,
      entity_type: p.entityType ?? null,
      entity_id: p.entityId ?? null,
      details: p.details ?? {},
    });
  } catch {
    /* activity logging must never block the main action */
  }
}

export const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export function timeAgo(s: string): string {
  const mins = Math.round((Date.now() - new Date(s).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return fmtDate(s);
}

export const inviteLink = (token: string) => `${window.location.origin}/accept-invite?token=${token}`;

export function safePath(p: string | null): string {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/app";
}

export function slugify(s: string): string {
  const base = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return `${base || "agency"}-${Math.random().toString(36).slice(2, 6)}`;
}

export const actionLabel = (a: string) => a.replace(/[._]/g, " ");
