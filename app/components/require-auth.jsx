import { useAuth } from "@clerk/react-router";
import { Navigate, useLocation } from "react-router";
import { getAuthRedirectDestination } from "./require-auth-redirect";

export function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const redirectDestination = getAuthRedirectDestination({
    isLoaded,
    isSignedIn,
    pathname: location.pathname,
    search: location.search,
  });

  if (!isLoaded) return <div>...loading</div>;

  if (redirectDestination) {
    return <Navigate to={redirectDestination} replace />;
  }

  return children;
}
