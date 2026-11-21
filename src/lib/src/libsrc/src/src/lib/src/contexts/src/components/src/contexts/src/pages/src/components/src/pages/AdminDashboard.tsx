import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Globe, Radio, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "../components/Spinner";
import {
  WEBSITE_STATUS_LABELS,
  type ActivityLog,
  type Website,
  type WebsiteStatus,
} from "../lib/types";

interface Stats {
  clients: number;
  websites: number;
  live: number;
}

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
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    websites: 0,
    live: 0,
  });
  const [recentWebsites, setRecentWebsites] = useState<Website[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      const [clientsRes, websitesRes, liveRes, recentRes, activityRes] =
        await Promise.all([
          supabase
            .from("clients")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("websites")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("websites")
            .select("id", { count: "exact", head: true })
            .eq("status", "live"),
          supabase
            .from("websites")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(5),
          supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

      if (!active) return;

      const firstError =
        clientsRes.error ??
        websitesRes.error ??
        liveRes.error ??
        recentRes.error ??
        activityRes.error;

      setError(firstError ? firstError.message : null);
      setStats({
        clients: clientsRes.count ?? 0,
        websites: websitesRes.count ?? 0,
        live: liveRes.count ?? 0,
      });
      setRecentWebsites((recentRes.data as Website[] | null) ?? []);
      setActivity((activityRes.data as ActivityLog[] | null) ?? []);
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
          <h1>Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <div className="muted">
            Here is what is happening across your clients and websites.
          </div>
        </div>
      </div>

      {error ? (
        <div className="alert alert-warning">
          Some data could not be loaded: {error}. If you have not created the
          database tables yet, this is expected. We will set them up in the
          database phase.
        </div>
      ) : null}

      <div className="grid grid-3 mb-2">
        <div className="card stat-card">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">{loading ? "-" : stats.clients}</div>
            <div className="stat-label">Clients</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <Globe size={22} />
          </div>
          <div>
            <div className="stat-value">{loading ? "-" : stats.websites}</div>
            <div className="stat-label">Websites</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <Radio size={22} />
          </div>
          <div>
            <div className="stat-value">{loading ? "-" : stats.live}</div>
            <div className="stat-label">Live websites</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Recent websites</h3>
            <Link to="/websites" className="btn btn-secondary btn-sm">
              View all
            </Link>
          </div>
          {loading ? (
            <Spinner label="Loading..." />
          ) : recentWebsites.length === 0 ? (
            <div className="empty-state">No websites yet.</div>
          ) : (
            <ul className="list">
              {recentWebsites.map((site) => (
                <li className="list-item" key={site.id}>
                  <div className="grow">
                    <div style={{ fontWeight: 600 }}>{site.name}</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>
                      {site.domain ?? "No domain set"}
                    </div>
                  </div>
                  <span className={statusBadgeClass(site.status)}>
                    {WEBSITE_STATUS_LABELS[site.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent activity</h3>
            <Activity size={18} className="muted" />
          </div>
          {loading ? (
            <Spinner label="Loading..." />
          ) : activity.length === 0 ? (
            <div className="empty-state">No activity recorded yet.</div>
          ) : (
            <ul className="list">
              {activity.map((entry) => (
                <li className="list-item" key={entry.id}>
                  <div className="grow">
                    <div style={{ fontWeight: 600 }}>{entry.action}</div>
                    {entry.details ? (
                      <div className="muted" style={{ fontSize: "0.85rem" }}>
                        {entry.details}
                      </div>
                    ) : null}
                  </div>
                  <span className="muted" style={{ fontSize: "0.8rem" }}>
                    {formatDate(entry.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
