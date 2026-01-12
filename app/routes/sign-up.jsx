import { SignUp, useUser } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp forceRedirectUrl="/app/dashboard" />
    </div>
  );
}
