import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullPageSpinner } from "./ui";

export default function Guard({ need }: { need: "auth" | "staff" | "client" }) {
  const a = useAuth();
  const loc = useLocation();
  if (a.loading) return <FullPageSpinner />;
  if (!a.session) return <Navigate to={`/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  if (need === "auth") return <Outlet />;
  if (!a.membership) return <Navigate to="/onboarding" replace />;
  if (need === "staff" && !a.isStaff) return <Navigate to="/app" replace />;
  if (need === "client" && !a.isClient) return <Navigate to="/app" replace />;
  return <Outlet />;
}

export function AppRedirect() {
  const a = useAuth();
  if (a.loading) return <FullPageSpinner />;
  if (!a.session) return <Navigate to="/login" replace />;
  if (!a.membership) return <Navigate to="/onboarding" replace />;
  return <Navigate to={a.isClient ? "/portal" : "/admin"} replace />;
}
