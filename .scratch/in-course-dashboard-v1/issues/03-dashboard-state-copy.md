Type: grilling
Status: resolved

## Question

What user-visible states and copy should the single dashboard composition use for not enrolled, enrolled with no sessions, enrolled with sessions, completed, loading, and load failure, without making empty data look like real performance?

Blocked by: 01

## Comments

- Agreed: `notEnrolled` should show an **Enroll to start** action leading to the course detail/purchase flow.
- Agreed: `firstSession` should show **Start Day 1** with welcoming first-session copy.
- Agreed: `inProgress` should show **Continue Day N** with enrollment-derived progress copy.
- Agreed: `completed` should show **Course Complete**, acknowledge all N days, and have no CTA; progress is visually complete.
- Agreed: `loading` should use simple skeleton placeholders that preserve the final card layout.
- Agreed: `loadError` gets one automatic retry (`retry: 1`, meaning two total attempts), then shows a manual **Retry** action.

## Answer

Use these user-visible states and copy rules:

- `notEnrolled`: **Enroll to start**, linking to the course detail/purchase flow.
- `firstSession`: **Start Day 1**, with welcoming first-session copy and no fake performance values.
- `inProgress`: **Continue Day N**, with enrollment-derived progress such as `N - 1 of total days completed`.
- `completed`: **Course Complete**, acknowledge all course days, show 100% progress, and provide no CTA until the dedicated practice route exists.
- `loading`: skeleton placeholders that preserve the final card layout.
- `loadError`: one automatic retry, then a compact error message and manual **Retry** action.

These states are derived from the route-level view model in [dashboard view model](01-dashboard-view-model.md), keeping successful empty data separate from request failures.
