import { SignUp } from "@clerk/react-router";
import { useSearchParams } from "react-router";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/app/dashboard";

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp forceRedirectUrl={redirectUrl} />
    </div>
  );
}
