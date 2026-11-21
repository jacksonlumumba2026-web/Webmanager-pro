import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { FullPageSpinner } from "./components/Spinner";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ComingSoon, { NotFound } from "./pages/ComingSoon";

// Only lets logged-in users with an active admin or client account through.
// Everyone else is sent to the login page.
function RequireAuth() {
  const { session, loading, isAdmin, isClient, isRecovery } = useAuth();

  if (loading) {
    return <FullPageSpinner label="Loading..." />;
  }

  if (!session || isRecovery || !(isAdmin || isClient)) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
}

// Pages that only administrators may open.
function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// The home page depends on the role.
function Home() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route index element={<Home />} />
            <Route
              path="clients"
              element={
                <AdminOnly>
                  <ComingSoon
                    title="Clients"
                    description="Add and manage your clients and their login accounts. Coming in the client management phase."
                  />
                </AdminOnly>
              }
            />
            <Route
              path="websites"
              element={
                <AdminOnly>
                  <ComingSoon
                    title="Websites"
                    description="Your website portfolio, code editor and publishing tools. Coming in the website management phase."
                  />
                </AdminOnly>
              }
            />
            <Route
              path="settings"
              element={
                <ComingSoon
                  title="Settings"
                  description="Account and branding settings. Coming in a later phase."
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
