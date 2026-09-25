import { useQueries } from "@tanstack/react-query";
import { useSession, useAuth } from "@clerk/react-router";
// @ts-expect-error Legacy JavaScript API modules have no declaration files yet.
import { fetchEnrollment } from "../api/enrollment";
// @ts-expect-error Legacy JavaScript modules have no declaration files yet.
import { queryKeys } from "./keys";

/** The enrolled branch of GET /api/enrollments/check/:courseId. */
export interface EnrollmentCheck {
  enrolled: boolean;
  currentDay?: number;
  totalDays?: number;
  enrolledAt?: string;
  purchaseType?: string;
  reason?: string;
}

/**
 * Enrollment check for every course at once, one query per courseId.
 *
 * Uses the same cache key as `useEnrollment` so any consumer — this hook,
 * the single-course hook, the learn layout, or `useCompleteDay`'s
 * invalidation — reads and invalidates one shared entry per course.
 * `useQueries` (rather than a `.map()` of `useEnrollment`) keeps the hook
 * count stable while the course list resolves from undefined to N items.
 */
export function useEnrollments(
  courseIds: readonly string[],
  options: { enabled?: boolean } & Record<string, unknown> = {},
) {
  const { session } = useSession();
  const { isSignedIn } = useAuth();
  const { enabled = true, ...queryOptions } = options;

  return useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: queryKeys.enrollment.check(courseId),
      queryFn: async (): Promise<EnrollmentCheck> => {
        const token = await session?.getToken();
        return fetchEnrollment(token, courseId);
      },
      enabled: !!isSignedIn && !!courseId && enabled,
      staleTime: 1000 * 60 * 5,
      ...queryOptions,
    })),
  });
}
