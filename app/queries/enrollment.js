import { useQuery } from "@tanstack/react-query";
import { useSession, useAuth } from "@clerk/react-router";
import { fetchEnrollment } from "../api/enrollment";
import { queryKeys } from "./keys";

export default function useEnrollment(courseId) {
  const { session } = useSession();
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.enrollment.check(courseId),
    queryFn: async () => {
      const token = await session.getToken();
      return fetchEnrollment(token, courseId);
    },
    enabled: !!isSignedIn && !!courseId,
    staleTime: 1000 * 60 * 5,
  });
}
