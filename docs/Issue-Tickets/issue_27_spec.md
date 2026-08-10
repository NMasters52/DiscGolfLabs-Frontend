Status: ready-for-agent

## Problem Statement

The current dashboard is split across divergent branches and competing visual directions. It mixes mock data, raw API responses, separate mobile and desktop compositions, hardcoded course-completion content, and incomplete loading/error behavior.

As a result, a signed-in player cannot reliably understand what to do next in the putting course or trust that the numbers shown represent their real progress. Brand-new users, returning users, completed users, and failed requests are not represented as distinct product states.

## Solution

Build an in-course dashboard v1 on the `feat/dashboard` branch using real data from the existing course, enrollment, putting stats, and putting-session APIs.

The dashboard will use one responsive Command center composition:

1. A dynamic course card at the top.
2. Course progress within that card.
3. An overall make-rate card below it.
4. A last-session summary below it.

The route will normalize API responses at one high-level view-model seam. That seam will derive explicit states for not enrolled, first session, in progress, completed, loading, and load failure. Empty successful responses will remain distinct from request failures.

## User Stories

1. As a signed-in player who is not enrolled, I want to see that I need to enroll, so that I know how to begin the course.
2. As a signed-in player who is not enrolled, I want an **Enroll to start** action, so that I can reach the course detail and purchase flow.
3. As a newly enrolled player with no sessions, I want to see **Start Day 1**, so that the dashboard gives me an immediate first step.
4. As a newly enrolled player with no sessions, I want the dashboard to explain that my first session has not happened yet, so that empty metrics do not look like failed performance.
5. As a returning player with a current course day, I want to see **Continue Day N**, so that the next course step is obvious.
6. As a returning player, I want to see how many course days I have completed, so that I understand my position in the course.
7. As a returning player, I want to see a visual progress indicator, so that progress is understandable at a glance.
8. As a player with session history, I want to see my latest session summary, so that I can remember what I last practiced and how it went.
9. As a player with session history, I want the latest-session summary to use the newest session returned by the API, so that the dashboard does not show stale data.
10. As a player with session history, I want to see my make rate, so that I can understand a useful high-level performance signal.
11. As a player, I want the make-rate label to communicate that it represents the API's recent period, so that I do not mistake a 30-day metric for lifetime performance.
12. As a player who completes the course, I want to see **Course Complete**, so that the dashboard acknowledges my finished course.
13. As a completed player, I want completed progress to display as 100%, so that the course state is unambiguous.
14. As a completed player, I do not want to see a misleading continue or practice action yet, so that the dashboard does not send me into an undefined route.
15. As a player loading the dashboard, I want skeleton placeholders that preserve the final layout, so that the page does not jump when data arrives.
16. As a player whose dashboard request fails, I want a concise explanation and a manual **Retry** action, so that I can recover without refreshing the whole page.
17. As a player experiencing a transient request failure, I want one automatic retry before the error state appears, so that brief network interruptions do not immediately interrupt me.
18. As a player on a phone, I want the same dashboard content to stack naturally, so that I can understand the course without a separate mobile information model.
19. As a player on a larger screen, I want the make rate and last-session summary to sit beneath the course card in a two-column arrangement, so that the hierarchy remains clear without wasting space.
20. As a player using light or dark theme, I want all dashboard states to remain readable, so that the dashboard is dependable regardless of theme preference.
21. As a developer, I want components to receive normalized view data rather than raw API payloads, so that UI state is predictable and testable.
22. As a developer, I want successful empty data to be distinct from failed requests, so that product copy does not hide operational problems.
23. As a developer, I want the dashboard to use existing API contracts first, so that v1 does not expand into an unnecessary backend redesign.
24. As a developer, I want the selected Command center composition to be implemented without carrying the rejected prototype variants into production, so that the code remains focused.

## Implementation Decisions

- The implementation target is the local `feat/dashboard` branch. The older `feature/dashboard` branch remains historical reference only.
- The dashboard will use one responsive composition rather than separate mobile and desktop dashboard implementations.
- The selected composition is Prototype A, **Command center**: a hero-first course card followed by make rate and latest-session content in a responsive two-column arrangement that stacks on smaller screens.
- The primary user job is “tell me what to do next in the course, then give me enough performance context to understand progress.”
- The route will own the data orchestration and normalization boundary. Presentation components will not fetch their own dashboard data or import mock dashboard data.
- The route-level view model will expose explicit states: `loading`, `loadError`, `notEnrolled`, `firstSession`, `inProgress`, and `completed`.
- `notEnrolled` is derived from a successful enrollment response with `enrolled: false`; it is not a request failure.
- `firstSession` is derived from an enrolled user with no putting sessions.
- `inProgress` is derived from an enrolled user with at least one putting session and a current day within the course.
- `completed` is derived when enrollment `currentDay` is greater than the course's `totalDays`; displayed progress is clamped to 100%.
- The dynamic course card uses **Enroll to start**, **Start Day 1**, **Continue Day N**, or **Course Complete** according to the normalized state.
- The completed course card has no CTA in v1. A dedicated practice route and backend data-saving contract will be planned separately.
- Course metadata, enrollment status, aggregated putting stats, and putting-session history will use the existing API endpoints.
- A small session-history query will feed the latest-session summary. The API returns sessions oldest-first, so the latest session is the final item in the successful response.
- The latest-session summary will normalize session identity, day number, made putts, attempted putts, make rate, maximum distance, duration, and creation date.
- The make-rate display will be labeled as a recent-period metric because the current stats endpoint defaults to the last 30 days. It will not be presented as lifetime performance without a backend contract change.
- Empty states will not display fake performance numbers. Missing session data will produce intentional first-session copy.
- Loading will use layout-preserving skeletons.
- Required requests will make one automatic retry before exposing the load-failure state. In TanStack Query terms, this is `retry: 1`, which means two total attempts. The error state will provide a manual Retry action.
- The implementation will add only the smallest frontend query or normalization needed to consume the existing API. No backend schema or practice-route changes are part of v1.
- The rejected B and C prototype layouts remain on the throwaway prototype branch as design evidence but will not be carried into production.

## Testing Decisions

- The primary test seam is a route-level view-model adapter that accepts course, enrollment, stats, session, loading, and error results and returns the normalized dashboard state and display data.
- Tests should assert external behavior and derived state, not component implementation details or Tailwind class names.
- The adapter should be exercised with five fixture cases: not enrolled, enrolled with no sessions, enrolled with sessions, completed, and load failure after one retry.
- The enrolled-with-sessions fixture should include an oldest-first session list so the test proves the latest-session selection rule.
- The completed fixture should use `currentDay > totalDays` and verify 100% progress with no CTA.
- The empty fixture should verify that make rate and last-session values are represented as absent/empty rather than fake zero-valued performance.
- The failure fixture should verify that the first failure triggers one retry and the second failure produces the manual Retry state.
- Browser verification should cover 375×812, 768×1024, and 1440×900 viewports.
- Browser verification should run in light and dark themes.
- Browser verification should confirm the Command center hierarchy, mobile stacking, desktop two-column supporting content, readable copy, no horizontal overflow, and no completed CTA.
- The production build is a required smoke check.
- The repository currently has no configured test runner or prior automated dashboard tests. The implementation should introduce the smallest focused test seam for the view-model adapter, with browser QA covering the rendered responsive behavior until broader UI test infrastructure exists.

## Out of Scope

- A dedicated general-purpose practice route.
- A backend contract for saving sessions from a new practice route.
- Reworking the putting-game route or course lesson route.
- Deep analytics, charts, comparisons, weakest-distance insights, streak design, new goals, or celebration effects.
- A redesign of the course-completion journey beyond the minimal completed card.
- A new dashboard backend endpoint or schema migration.
- Carrying the old `feature/dashboard` branch wholesale into the implementation.
- Shipping the prototype switcher or rejected layout variants.

## Further Notes

- The full decision history is preserved in the local Wayfinder map and resolved tickets for `in-course-dashboard-v1`.
- Prototype A is the authoritative visual direction for the first implementation pass.
- The implementation should begin from the current `feat/dashboard` branch and leave the old `feature/dashboard` branch untouched.
- Before implementation starts, the local spec and map should be committed if they are not already part of the branch history.
