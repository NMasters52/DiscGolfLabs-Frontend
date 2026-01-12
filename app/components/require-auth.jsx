import { useAuth } from "@clerk/react-router";
import { Navigate, useLocation } from "react-router";

export function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    const returnTo = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({ redirect_url: returnTo });

    return <Navigate to={`/sign-in?${params.toString()}`} replace />;
  }

  return children;
}
