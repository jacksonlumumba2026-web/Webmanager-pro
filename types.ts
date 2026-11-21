export type Organization = { id: string; name: string; slug: string };
export type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: "active" | "pending" | "inactive";
  created_at: string;
};
export type Website = {
  id: string;
  name: string;
  domain: string | null;
  live_url: string | null;
  hosting_provider: "github_pages" | "truehost" | "other";
  status: "draft" | "active" | "paused" | "archived";
  client_id: string;
  clients?: { business_name: string } | null;
};
