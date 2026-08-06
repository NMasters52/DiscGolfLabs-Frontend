# Dashboard view-model research

## Recommendation

Keep the API calls separate and normalize their results once at the dashboard route boundary. Components should receive a small, explicit view model rather than raw API payloads or `any` values.

Suggested state model:

```ts
type DashboardStatus =
  | "loading"
  | "loadError"
  | "notEnrolled"
  | "firstSession"
  | "inProgress"
  | "completed";
```

Suggested route-level model:

```ts
type DashboardViewModel = {
  status: Exclude<DashboardStatus, "loading" | "loadError">;
  course: {
    id: string;
    slug: string;
    title: string;
    totalDays: number;
  };
  progress: {
    currentDay: number;
    completedDays: number;
    totalDays: number;
    percent: number;
    isComplete: boolean;
  } | null;
  makeRate: number | null;
  lastSession: {
    id: string;
    dayNumber: number | null;
    makeRate: number;
    made: number;
    attempted: number;
    maxDistanceFt: number;
    durationSeconds: number | null;
    createdAt: string;
  } | null;
};
```

`makeRate` should be labelled as a recent-period metric in v1. The API's `overall` stats are calculated from the last 30 days by default, not from all historical sessions.

## Evidence

- The main dashboard route currently fetches stats, course, and enrollment but passes raw values through separate layout branches: `app/routes/app/dashboard/index.tsx:12-32`.
- A session query and API helper already exist on `main`, but the dashboard route does not use them: `app/queries/useGameSession.js:1-17`, `app/api/games.js:21-37`.
- The enrollment endpoint explicitly returns `{ enrolled: false }` with HTTP 200, so not-enrolled is a successful state rather than a load failure: `../DiscGolfLabs-api/src/routes/enrollment.js:16-42`.
- Enrollment progress starts at `currentDay: 1` and completion increments it: `../DiscGolfLabs-api/src/models/Enrollment.js:17-30`, `../DiscGolfLabs-api/src/controllers/enrollmentController.js:15-42`.
- Course metadata supplies the stable slug, title, and ordered day list: `../DiscGolfLabs-api/src/models/Course.js:3-19`.
- Session history is returned oldest-first and includes the normalized fields needed for the latest-session summary: `../DiscGolfLabs-api/src/controllers/puttingGameController.js:57-122`.
- Aggregated stats calculate the current period from the last 30 days unless a different `days` query is supplied: `../DiscGolfLabs-api/src/controllers/puttingGameController.js:125-143`, with the `overall` response fields at `333-365`.

## State derivation

- `loadError`: any required query fails.
- `notEnrolled`: the enrollment response is successful and `enrolled === false`.
- `completed`: enrollment is true and `currentDay > totalDays`; clamp displayed progress to 100%.
- `firstSession`: enrollment is true, not completed, and the filtered session list is empty.
- `inProgress`: enrollment is true, not completed, and at least one session exists.

The course card's CTA label is derived from state and enrollment progress, but the completed CTA remains absent in this effort because the dedicated practice route is out of scope.
