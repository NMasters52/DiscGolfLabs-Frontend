import { SignOutButton } from "@clerk/react-router";

import useMe from "../../../queries/useMe";
import { Button } from "../../../components/ui/button";

export default function Dashboard() {
  const { data, error, isPending } = useMe();

  if (error) {
    return <div>Error</div>;
  }

  if (isPending) {
    return <div>Is Loading...</div>;
  }

  //testing that data is being fetched
  if (data) {
    console.table(data);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <SignOutButton redirectUrl="/">
        <Button variant="destructive">Sign Out</Button>
      </SignOutButton>
      <h1>Welcome, {data?.name || "guest"}</h1>
    </div>
  );
}
