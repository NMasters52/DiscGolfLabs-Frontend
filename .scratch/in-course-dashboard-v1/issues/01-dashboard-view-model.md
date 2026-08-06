Type: research
Status: resolved

## Question

Given the existing course, enrollment, aggregated stats, and putting-session endpoints, what exact route-level view model should the dashboard expose for the in-progress, first-time, completed, and failure states, and which fields should be normalized at the route boundary?

Blocked by:

## Comments

## Answer

Use a route-level normalization boundary with explicit dashboard states: `loading`, `loadError`, `notEnrolled`, `firstSession`, `inProgress`, and `completed`. Keep the existing course, enrollment, stats, and session requests separate; components receive a small `DashboardViewModel` rather than raw API payloads.

The enrollment response is the source of truth for not-enrolled versus enrolled. `enrolled: false` is a successful state, not an error. Completion is derived when `currentDay > totalDays`; displayed progress should be clamped to 100%. An enrolled user with no sessions is the first-session state; an enrolled user with at least one session is in progress.

Use the latest item from the session-history response for the last-session summary. Treat the API's `overall.makeRate` as a recent-period metric because the endpoint defaults to the last 30 days; do not silently present it as lifetime performance.

Research notes: [01-dashboard-view-model.md](../research/01-dashboard-view-model.md)
