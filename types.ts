export type Role = "owner" | "admin" | "manager" | "developer" | "viewer" | "client";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}
export interface Organization {
  id: string;
  name: string;
  slug: string;
}
export interface Membership {
  id: string;
  role: Role;
  organization_id: string;
  organization: Organization | null;
}
export interface Client {
  id: string;
  organization_id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  status: "active" | "inactive" | "archived";
  user_id: string | null;
  created_at: string;
}
export interface Website {
  id: string;
  organization_id: string;
  client_id: string | null;
  name: string;
  domain: string | null;
  repository_provider: string;
  repository_owner: string | null;
  repository_name: string | null;
  deployment_provider: string;
  production_url: string | null;
  status: "setup" | "active" | "maintenance" | "offline" | "archived";
  created_at: string;
  updated_at: string;
  clients?: { company_name: string } | null;
}
export interface ActivityLog {
  id: string;
  organization_id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}
export interface ChangeRequest {
  id: string;
  website_id: string;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "done" | "rejected" | "cancelled";
  priority: "low" | "normal" | "high";
  created_at: string;
}
export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: Role;
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string;
  created_at: string;
}
