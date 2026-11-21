import { useEffect, useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "../components/Spinner";
import {
  PUBLISH_TARGET_LABELS,
  WEBSITE_STATUS_LABELS,
  type Website,
  type WebsiteStatus,
} from "../lib/types";

function statusBadgeClass(status: WebsiteStatus): string {
  switch (status) {
    case "live":
      return "badge badge-success";
    case "in_progress":
      return "badge badge-primary";
    case "paused":
      return "badge badge-warning";
    default:
      return "badge";
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      // The database security rules (added in the database phase) make sure
      // a client only ever receives the websites assigned to them.
      const { data, error: loadError } = await supabase
        .from("websites")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!active) return;

      setError(loadError ? loadError.message : null);
      setWebsites((data as Website[] | null) ?? []);
      setLoading(false);
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Welcome{firstName ? `, ${firstName}` : ""}</h1>
          <div className="muted">
            Your websites, their status and where they are published.
          </div>
        </div>
      </div>

      {error ? (
        <div className="alert alert-warning">
          Your websites could not be loaded: {error}. Please try again later or
          contact your administrator.
        </div>
      ) : null}

      {loading ? (
        <div className="card">
          <Spinner label="Loading your websites..." />
        </div>
      ) : websites.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Globe size={32} />
            <p className="mt-1">
              No websites have been assigned to you yet. Your administrator will
              add them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {websites.map((site) => (
            <div className="card" key={site.id}>
              <div className="card-header">
                <h3>{site.name}</h3>
                <span className={statusBadgeClass(site.status)}>
                  {WEBSITE_STATUS_LABELS[site.status]}
                </span>
              </div>

              <div className="muted mb-1">{site.domain ?? "No domain set"}</div>

              <div className="muted" style={{ fontSize: "0.85rem" }}>
                Published on: {PUBLISH_TARGET_LABELS[site.publish_target]}
              </div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                Last updated: {formatDate(site.updated_at)}
              </div>

              {site.live_url ? (
                <a
                  className="btn btn-secondary btn-sm mt-2"
                  href={site.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  Visit website
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
