import { Outlet } from "react-router";
import { RequireAuth } from "../../components/require-auth";

export default function AppLayout() {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
}
