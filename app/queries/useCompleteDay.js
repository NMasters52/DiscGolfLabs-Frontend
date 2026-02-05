import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { completeDay } from "../api/enrollment";
import { queryKeys } from "./keys";

export default function useCompleteDay(courseId) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (day) => {
      console.log("🔥 MUTATION FN CALLED WITH DAY:", day);
      const token = await getToken();
      return completeDay(token, courseId, day);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollment.check(courseId),
      });
    },
  });
}
