import { Outlet } from "react-router";
import { RequireAuth } from "../../components/require-auth";
import { AppShell } from "../../components/app/AppShell";

// `/app` is the authenticated product boundary: authenticate first, then
// render the shared shell around whichever nested route matched. Nested
// layouts (e.g. course learning) authorize data access on top of this.
export default function AppLayout() {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  );
}
