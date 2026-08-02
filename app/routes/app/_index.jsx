import { Navigate } from "react-router";

// Authenticated app entry point — `/app` itself has no content, so send
// users to the dashboard. (Auth gating is handled by routes/app/_layout.jsx.)
export default function AppIndex() {
  return <Navigate to="/app/dashboard" replace />;
}
