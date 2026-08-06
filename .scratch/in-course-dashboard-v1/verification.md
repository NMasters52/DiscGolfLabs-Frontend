# Dashboard v1 verification matrix

## Fixture cases

1. `notEnrolled`
   - Course succeeds.
   - Enrollment returns `{ enrolled: false }`.
   - Stats and sessions are not treated as a reason to render course progress.
   - Expect **Enroll to start** and no performance numbers.
2. `firstSession`
   - Enrollment returns `enrolled: true`, `currentDay: 1`, `totalDays: 5`.
   - Session list is empty.
   - Stats returns zero/empty aggregates.
   - Expect **Start Day 1**, 0% course progress, and an intentional no-session state.
3. `inProgress`
   - Enrollment returns `currentDay: 3`, `totalDays: 5`.
   - Session list contains at least one normalized session.
   - Stats contains a recent-period make rate.
   - Expect **Continue Day 3**, 40% progress, make rate, and latest-session summary.
4. `completed`
   - Enrollment returns `currentDay: 6`, `totalDays: 5`.
   - Stats and session history may contain real data.
   - Expect a minimal completion card, 100% progress, and no CTA.
5. `loadError`
   - One required request fails twice.
   - Expect skeleton first, one automatic retry, then a compact error state with manual Retry.

## Viewport checks

- 375 × 812: all cards stack; no horizontal overflow; the course card remains first.
- 768 × 1024: transition remains readable with no clipped controls or overly wide text blocks.
- 1440 × 900: Command center hero spans the content width; make rate and latest session sit beneath it in two columns.
- Repeat the checks in light and dark themes.

## Assertions

- State copy matches the route-level status; no fake metrics appear in empty states.
- Progress is clamped to 0–100% and completed progress is exactly 100%.
- The latest session comes from the final item in the API's oldest-first list.
- The make-rate label communicates the API's recent-period meaning.
- Completed cards have no action button.
- The browser console has no new errors and the production build succeeds.

The repository has no test runner configured, so the first implementation pass should use fixture-driven rendering plus browser QA. A later test-ticket can introduce automated coverage if the normalized view model gets a stable pure-function seam.
