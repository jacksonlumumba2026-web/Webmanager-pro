import { Link } from "react-router-dom";
import { Compass, Wrench } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

// Placeholder for menu pages we have not built yet.
// It is replaced by the real page as each phase is completed.
export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <>
      <div className="page-header">
        <h1>{title}</h1>
      </div>
      <div className="card">
        <div className="empty-state">
          <Wrench size={32} />
          <h3 className="mt-1">Coming soon</h3>
          <p>
            {description ??
              "This section is being built and will be available in an upcoming phase."}
          </p>
        </div>
      </div>
    </>
  );
}

// Shown when someone opens an address that does not exist.
export function NotFound() {
  return (
    <>
      <div className="page-header">
        <h1>Page not found</h1>
      </div>
      <div className="card">
        <div className="empty-state">
          <Compass size={32} />
          <p className="mt-1">
            We could not find the page you were looking for.
          </p>
          <Link to="/" className="btn">
            Back to dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
