import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn forceRedirectUrl="/app/dashboard" />
    </div>
  );
}
