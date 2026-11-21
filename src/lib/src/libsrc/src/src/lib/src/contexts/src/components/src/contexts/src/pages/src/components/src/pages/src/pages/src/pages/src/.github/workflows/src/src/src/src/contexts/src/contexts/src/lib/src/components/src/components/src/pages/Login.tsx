import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { FullPageSpinner, Spinner } from "../components/Spinner";

type Mode = "signin" | "forgot";

export default function Login() {
  const {
    session,
    profile,
    profileError,
    loading,
    isAdmin,
    isClient,
    isRecovery,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
  } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (loading) {
    return <FullPageSpinner label="Checking your session..." />;
  }

  // Already logged in with a valid account: go to the right dashboard.
  if (session && !isRecovery && (isAdmin || isClient)) {
    return <Navigate to="/" replace />;
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const message = await signIn(email, password);
    setBusy(false);
    if (message) setError(message);
  }

  async function handleForgot(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const message = await sendPasswordReset(email);
    setBusy(false);
    if (message) {
      setError(message);
    } else {
      setNotice(
        "If an account exists for that email, a reset link has been sent. Check your inbox."
      );
    }
  }

  async function handleNewPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (newPassword.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    const message = await updatePassword(newPassword);
    setBusy(false);
    if (message) setError(message);
    // On success the app redirects to your dashboard automatically.
  }

  const brand = (
    <>
      <div className="auth-brand">
        <span className="logo">
          <Globe size={20} />
        </span>
        WebManager Pro
      </div>
      <p className="muted text-center mb-2">
        Manage, edit and publish websites in one place.
      </p>
    </>
  );

  // ---- Screen A: choose a new password (after clicking the reset email) ----
  if (isRecovery && session) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          {brand}
          <h2>Set a new password</h2>
          {error ? <div className="alert alert-error">{error}</div> : null}
          <form onSubmit={handleNewPassword}>
            <div className="field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                className="input"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="field-hint">At least 8 characters.</div>
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                className="input"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? <Spinner /> : "Save new password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Screen B: logged in, but no usable account on this platform ----
  if (session) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          {brand}
          <div className="alert alert-warning">
            {profileError
              ? `We could not load your account: ${profileError}`
              : !profile
              ? "You are signed in, but no WebManager Pro account is linked to this login yet. Please contact your administrator."
              : "Your account is currently disabled. Please contact your administrator."}
          </div>
          <button
            className="btn btn-secondary btn-block"
            type="button"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ---- Screen C: forgot password ----
  if (mode === "forgot") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          {brand}
          <h2>Reset your password</h2>
          <p className="muted">
            Enter your email and we will send you a link to choose a new
            password.
          </p>
          {error ? <div className="alert alert-error">{error}</div> : null}
          {notice ? <div className="alert alert-success">{notice}</div> : null}
          <form onSubmit={handleForgot}>
            <div className="field">
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                className="input"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-block" type="submit" disabled={busy}>
              {busy ? <Spinner /> : "Send reset link"}
            </button>
          </form>
          <p className="text-center mt-2 mb-1">
            <a
              href="#/login"
              onClick={(e) => {
                e.preventDefault();
                switchMode("signin");
              }}
            >
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ---- Screen D: normal sign in ----
  return (
    <div className="auth-page">
      <div className="auth-card">
        {brand}
        <h2>Sign in</h2>
        {!isSupabaseConfigured ? (
          <div className="alert alert-warning">
            The app is not connected to Supabase yet. The publishable key has
            not been added to the GitHub settings.
          </div>
        ) : null}
        {error ? <div className="alert alert-error">{error}</div> : null}
        <form onSubmit={handleSignIn}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-block"
            type="submit"
            disabled={busy || !isSupabaseConfigured}
          >
            {busy ? <Spinner /> : "Sign in"}
          </button>
        </form>
        <p className="text-center mt-2 mb-1">
          <a
            href="#/login"
            onClick={(e) => {
              e.preventDefault();
              switchMode("forgot");
            }}
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
                }
