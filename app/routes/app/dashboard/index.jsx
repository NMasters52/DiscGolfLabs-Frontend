import { SignOutButton } from "@clerk/react-router";
import useMe from "../../../queries/user";

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
        <button>Sign Out</button>
      </SignOutButton>
      <h1>Welcome, {data?.name || "guest"}</h1>
    </div>
  );
}
