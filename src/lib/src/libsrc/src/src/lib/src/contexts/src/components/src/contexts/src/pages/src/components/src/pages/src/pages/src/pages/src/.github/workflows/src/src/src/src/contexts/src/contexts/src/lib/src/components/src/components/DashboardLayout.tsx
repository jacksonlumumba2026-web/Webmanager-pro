import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/websites", label: "Websites", icon: Globe },
  { to: "/settings", label: "Settings", icon: Settings },
];

const CLIENT_NAV: NavItem[] = [
  { to: "/", label: "My websites", icon: Globe, end: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

// The sidebar and top bar shared by every page after login.
// Pages render inside <Outlet />.
export default function DashboardLayout() {
  const { profile, user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = isAdmin ? ADMIN_NAV : CLIENT_NAV;

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const currentItem = items.find((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to)
  );

  const displayName = profile?.full_name || profile?.email || user?.email || "";

  return (
    <div className="app-shell">
      {menuOpen ? (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside className={`sidebar${menuOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <span className="logo">
            <Globe size={18} />
          </span>
          WebManager Pro
        </div>

        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ color: "#fff", fontWeight: 600, wordBreak: "break-all" }}>
            {displayName}
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            {isAdmin ? "Administrator" : "Client"}
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block"
            onClick={() => void signOut()}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="topbar-title">
            {currentItem ? currentItem.label : "WebManager Pro"}
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
