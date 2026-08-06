Type: task
Status: resolved

## Question

What representative fixtures, API responses, and viewport checks are required to verify that the dashboard changes cards and copy correctly across all v1 states before implementation is handed off?

Blocked by: 02, 03

## Comments

## Answer

Verify five fixture cases: not enrolled, enrolled with no sessions, enrolled with sessions, completed, and load failure after one automatic retry. The fixtures should exercise the exact API distinctions already agreed: `{ enrolled: false }`, an empty session list, a populated oldest-first session list, `currentDay > totalDays`, and a request that fails twice.

Run responsive checks at 375px, 768px, and 1440px widths in both themes. Assert the Command center hierarchy, stacked mobile cards, no horizontal overflow, state-specific copy, clamped progress, no fake empty metrics, no completed CTA, and no new browser-console errors. `npm run build` remains the production smoke check.

Detailed matrix: [verification.md](../verification.md)
