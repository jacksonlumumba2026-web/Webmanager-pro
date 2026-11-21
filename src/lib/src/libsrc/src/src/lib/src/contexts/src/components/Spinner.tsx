interface SpinnerProps {
  label?: string;
}

// Small inline spinner, used inside buttons and cards.
export function Spinner({ label }: SpinnerProps) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
      role="status"
      aria-live="polite"
    >
      <span className="spinner" aria-hidden="true" />
      {label ? <span className="muted">{label}</span> : null}
    </span>
  );
}

// Fills the whole screen. Shown while the app checks who is logged in.
export function FullPageSpinner({ label = "Loading..." }: SpinnerProps) {
  return (
    <div className="center-screen">
      <Spinner label={label} />
    </div>
  );
}
