// Shared data types for WebManager Pro.
// These mirror the database tables we will create in Supabase,
// so the column names are snake_case on purpose.

export type UserRole = "admin" | "client";

export type WebsiteStatus =
  | "draft"
  | "in_progress"
  | "live"
  | "paused"
  | "archived";

// Where a website is published.
export type PublishTarget =
  | "github_pages"
  | "netlify"
  | "vercel"
  | "cloudflare_pages"
  | "custom";

// Who owns the GitHub repository behind a website.
export type RepoOwnership = "agency" | "client";

export type DeploymentStatus =
  | "queued"
  | "building"
  | "success"
  | "failed"
  | "cancelled";

export type BackupType = "manual" | "automatic" | "pre_publish";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  // White-label branding
  brand_name: string | null;
  logo_url: string | null;
  primary_color: string | null;
  created_at: string;
}

export interface Profile {
  id: string; // same as the Supabase auth user id
  organization_id: string | null;
  role: UserRole;
  full_name: string | null;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  // The login account linked to this client, if one was created.
  user_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Website {
  id: string;
  organization_id: string;
  client_id: string | null;
  name: string;
  domain: string | null;
  status: WebsiteStatus;
  publish_target: PublishTarget;
  live_url: string | null;
  repo_ownership: RepoOwnership;
  repo_owner: string | null; // GitHub username or organization
  repo_name: string | null;
  repo_branch: string;
  created_at: string;
  updated_at: string;
}

// Never contains the access token. Tokens stay on the server side only.
export interface GitHubConnection {
  id: string;
  organization_id: string;
  client_id: string | null;
  github_username: string;
  ownership: RepoOwnership;
  created_at: string;
}

export interface Deployment {
  id: string;
  website_id: string;
  triggered_by: string | null;
  status: DeploymentStatus;
  target: PublishTarget;
  commit_sha: string | null;
  message: string | null;
  url: string | null;
  created_at: string;
  finished_at: string | null;
}

export interface Backup {
  id: string;
  website_id: string;
  created_by: string | null;
  type: BackupType;
  label: string | null;
  storage_path: string;
  size_bytes: number | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  website_id: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

// Text shown to the user for each status or target.
export const WEBSITE_STATUS_LABELS: Record<WebsiteStatus, string> = {
  draft: "Draft",
  in_progress: "In progress",
  live: "Live",
  paused: "Paused",
  archived: "Archived",
};

export const PUBLISH_TARGET_LABELS: Record<PublishTarget, string> = {
  github_pages: "GitHub Pages",
  netlify: "Netlify",
  vercel: "Vercel",
  cloudflare_pages: "Cloudflare Pages",
  custom: "Custom hosting",
};

export const DEPLOYMENT_STATUS_LABELS: Record<DeploymentStatus, string> = {
  queued: "Queued",
  building: "Building",
  success: "Success",
  failed: "Failed",
  cancelled: "Cancelled",
};
