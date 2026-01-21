import { SignOutButton } from "@clerk/react-router";
import { useUser, useSession } from "@clerk/react-router";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const { session } = useSession();

  useEffect(() => {
    async function fetchUser() {
      if (!session) return;
      try {
        const token = await session.getToken();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token invalid");
        }

        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error("failed to fetch user");
      }
    }
    fetchUser();
  }, [session]);

  return (
    <div>
      <h1>Dashboard</h1>
      <SignOutButton redirectUrl="/">
        <button>Sign Out</button>
      </SignOutButton>
      <h1>Welcome, {user?.firstName}</h1>
    </div>
  );
}
