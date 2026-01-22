import { useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/react-router";
import { fetchUser } from "../api/user";
import { queryKeys } from "./keys";

export default function useMe() {
  const { session } = useSession();

  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: async () => {
      const token = await session.getToken();

      return fetchUser(token);
    },
  });
}
