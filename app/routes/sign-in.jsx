import { useAuth } from "@clerk/react-router";
import { Navigate, useSearchParams } from "react-router";
import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/app/dashboard";

  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to={redirectUrl} replace />;

  return <SignIn forceRedirectUrl={redirectUrl} />;
}
