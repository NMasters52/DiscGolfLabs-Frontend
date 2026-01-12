import { SignOutButton } from "@clerk/react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <SignOutButton redirectUrl="/">
        <button>Sign Out</button>
      </SignOutButton>
    </div>
  );
}
