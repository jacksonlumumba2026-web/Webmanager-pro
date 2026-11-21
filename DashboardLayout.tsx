import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, Globe, LayoutDashboard, LogOut, Menu, Settings, UserCog, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "../components/ui";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/websites", label: "Websites", icon: Globe },
  { to: "/admin/staff", label: "Team", icon: UserCog },
  { to: "/admin/activity", label: "Activity", icon: Activity },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];
const CLIENT_NAV: NavItem[] = [
  { to: "/portal", label: "My websites", icon: Globe, end: true },
  { to: "/portal/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ variant }: { variant: "admin" | "client" }) {
  const [open, setOpen] = useState(false);
  const { profile, user, orgName, role, signOut } = useAuth();
  const navigate = useNavigate();
  const items = variant === "admin" ? ADMIN_NAV : CLIENT_NAV;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-5"><Logo /></div>
      <div className="mx-3 mb-3 rounded-xl bg-surface px-3 py-2.5">
        <p className="truncate text-sm font-semibold">{orgName}</p>
        <p className="text-xs capitalize text-ink/60">{role}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-brand-soft text-brand-dark" : "text-ink/70 hover:bg-surface hover:text-ink"}`
            }
          >
            <i.icon className="h-[18px] w-[18px]" /> {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ink/10 p-3">
        <p className="truncate px-3 text-sm font-medium">{profile?.full_name || user?.email}</p>
        {profile?.full_name && <p className="truncate px-3 text-xs text-ink/60">{user?.email}</p>}
        <button
          className="btn-ghost mt-2 w-full !justify-start"
          onClick={async () => {
            await signOut();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink/10 bg-white lg:block">{sidebar}</aside>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink/10 bg-white px-4 lg:hidden">
        <Logo className="!text-base" />
        <button className="btn-ghost !p-2" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl">
            <button className="btn-ghost absolute right-2 top-2 !p-2" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
