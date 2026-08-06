## Destination

Produce a handoff-ready decision map for an in-course dashboard v1 that uses real data, has one responsive composition, and gives users a truthful next step without rebuilding the old dashboard wholesale.

## Notes

- Domain: authenticated putting-course dashboard.
- Use the existing frontend and API contracts first; add only the smallest missing normalization or query needed by the UI.
- Keep first-time empty states distinct from API/load failures.
- The completed course state is minimal and visible but unactionable in this effort.
- A dedicated practice route and backend contract for saving practice data are a separate future effort.
- Relevant skills: research, prototype, grilling, domain-modeling, and code-review before implementation handoff.
- Implementation target: `feat/dashboard`.

## Decisions so far

- [dashboard view model](issues/01-dashboard-view-model.md) — normalize API results at the route boundary and distinguish not-enrolled, first-session, in-progress, completed, loading, and failure states.
- [dashboard state copy](issues/03-dashboard-state-copy.md) — use truthful state-specific copy, skeleton loading, and one automatic retry before manual recovery.
- [minimal responsive composition](issues/02-minimal-responsive-composition.md) — use the hero-first Command center layout with make rate and last session beneath it.
- [dashboard verification](issues/04-dashboard-verification.md) — verify five data states across mobile, tablet, desktop, and both themes.

## Not yet specified


## Out of scope

- A dedicated general-purpose practice route.
- Backend changes for practice-session navigation or a new practice data-saving contract.
- Deep analytics, charts, comparisons, weakest-distance insights, streak design, new goals, and celebration effects.
