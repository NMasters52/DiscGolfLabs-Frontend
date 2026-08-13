# Issue #34: Dashboard Visual Refresh and Interactive Make Rate

> Status: **ready-for-agent**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-08-12

## Problem Statement

The real-data in-course dashboard correctly distinguishes loading, failure, enrollment, first-session, in-progress, and completed states, but its visual hierarchy and supporting performance cards do not yet communicate that information clearly.

The Course Progress card repeats completion information and gives most supporting text the same muted weight. The Make Rate card presents a single percentage without enough explanation, visual emphasis, or control over the API's supported time windows. The Last Session card includes maximum distance, which is not currently useful, while its more useful metrics lack visual structure. Enhancing these cards must not weaken the dashboard's truthful empty states, automatic retry behavior, snapshot-level failure boundary, responsive layout, or distinction between genuine zero values and unavailable data.

## Solution

Refresh the three-card dashboard composition so an enrolled player can understand their course position and next step within five seconds, then inspect useful performance context without the supporting cards competing with the course state.

The Course Progress card will receive clearer typography and non-duplicated progress copy. Make Rate will become an interactive card with a green circular percentage ring and a mobile-friendly 7D/30D/90D segmented control backed by the existing stats endpoint. Last Session will become a balanced four-metric grid containing Make rate, Putts, Date, and Duration with consistently muted icons.

The initial dashboard remains one coordinated snapshot with its existing automatic retry and whole-dashboard failure state. After that snapshot succeeds, changing the Make Rate period creates a card-local refresh and failure boundary so Course Progress and Last Session remain stable.

## User Stories

1. As an enrolled player, I want the dashboard's course state to be the strongest visual message, so that I immediately understand what comes next.
2. As a returning player, I want **Continue Day N** to remain the dominant headline, so that I can identify my next course day quickly.
3. As a newly enrolled player, I want **Start Day 1** to remain the dominant headline, so that my first step is unambiguous.
4. As a completed player, I want **Course Complete** to remain the dominant headline, so that completion is clearly acknowledged.
5. As a player who is not enrolled, I want **Enroll to start** to remain distinct from a failed request, so that a successful empty state is not presented as an error.
6. As a player, I want the course name separated from the completion summary, so that each line has one clear purpose.
7. As a player, I want the completion count shown only with the progress visualization, so that the Course Progress card does not repeat itself.
8. As a player, I want the course-progress percentage to have enough contrast to read as meaningful data, so that it does not disappear into supporting copy.
9. As a player, I want the existing cyan progress bar retained, so that course progress keeps its established visual identity.
10. As a player, I want the Course Progress card to remain unactionable in this pass, so that it does not lead to an undefined practice route.
11. As a player, I want Make Rate explained as the percentage of putts made over the selected recent period, so that I know what the number represents.
12. As a player, I want Make Rate shown in a circular ring, so that the single metric has a clear visual focus distinct from course progress.
13. As a player, I want the completed ring arc to use the dashboard's green accent color, so that Make Rate has a distinct but theme-aware identity.
14. As a player, I want the percentage itself to remain neutral foreground text, so that it stays readable without overusing the green accent.
15. As a player, I want to choose between 7, 30, and 90 days, so that I can inspect performance over useful recent periods.
16. As a player, I want 30 days selected on each new dashboard visit, so that the existing recent-period behavior remains the default.
17. As a player, I want all three timeframe options visible, so that the feature is discoverable without opening a dropdown.
18. As a phone user, I want each timeframe option to be easy to tap, so that changing periods does not require precise input.
19. As a keyboard user, I want visible focus and meaningful labels on each timeframe option, so that I can operate the control without a pointer.
20. As a player, I want the supporting explanation and footer to update with my selected timeframe, so that the card remains self-explanatory.
21. As a player, I want previously loaded timeframe results to reappear quickly during the same visit, so that switching back does not feel unnecessarily slow.
22. As a player, I do not want my selected timeframe persisted across visits, so that each dashboard visit starts from the predictable 30-day default.
23. As a player with a genuine 0% make rate, I want to see **0%**, so that real poor performance is not confused with missing information.
24. As a player with no sessions in the selected period, I want to see **—** and an intentional explanation, so that the dashboard does not invent a 0% result.
25. As a brand-new player, I want the Make Rate card to explain that my first session establishes the metric, so that an empty ring does not look broken.
26. As a player whose selected period is refreshing, I want the ring and surrounding card layout to remain stable, so that the interaction does not cause distracting movement.
27. As a player whose selected-period refresh fails, I want the percentage replaced by a Retry action with an explanation, so that I can recover without losing the rest of the dashboard.
28. As a player whose initial dashboard snapshot fails, I want the existing whole-dashboard error and Retry behavior preserved, so that coordinated request failures remain clear.
29. As a player, I want Last Session limited to Make rate, Putts, Date, and Duration, so that the card prioritizes useful information.
30. As a player, I want maximum distance removed from Last Session, so that the card does not emphasize an unhelpful metric.
31. As a player, I want each Last Session metric paired with an icon, so that the four values are easier to scan.
32. As a player, I want all Last Session icons to use one muted treatment, so that they support the information rather than introduce competing color signals.
33. As a player, I want the four Last Session metrics arranged in a stable two-by-two grid, so that the card is predictable at different widths.
34. As a player viewing a session with an unavailable field, I want that field to remain in place as **—**, so that the card does not reflow or imply a different information model.
35. As a brand-new player, I want the Last Session grid hidden in favor of intentional first-time copy, so that four unavailable values do not imply a session exists.
36. As a phone user, I want the two supporting cards to stack naturally, so that their information remains legible.
37. As a larger-screen user, I want the two supporting cards to share an equal-height row, so that the composition feels balanced.
38. As a player viewing stacked cards, I want the Make Rate ring centered beneath its text and control, so that the narrow layout has a clear focal point.
39. As a player viewing side-by-side cards, I want Make Rate copy and controls on the left and the ring on the right, so that the wide card uses its space well.
40. As a player, I want initial loading skeletons to match the final ring and four-metric layout, so that content does not jump when data arrives.
41. As a light- or dark-theme user, I want the green ring, neutral track, icons, text, and focus states to remain readable, so that the dashboard works in either theme.
42. As a developer, I want the selected day count included in the stats query key, so that 7-, 30-, and 90-day results do not overwrite one another.
43. As a developer, I want the existing stats endpoint reused with its supported day parameter, so that this feature does not require a new endpoint.
44. As a developer, I want period session count normalized separately from make rate, so that genuine zero and no-data states remain distinct.
45. As a developer, I want initial snapshot failure separated from later Make Rate refresh failure, so that one optional interaction cannot replace already loaded dashboard content.
46. As a developer, I want presentation components to consume normalized dashboard data, so that raw API irregularities do not leak into visual state decisions.
47. As a developer, I want the existing automatic retry policy preserved, so that transient failures still receive two total attempts before presenting recovery UI.
48. As a product owner, I want exact calendar dates deferred until the API returns authoritative period metadata, so that the frontend does not present browser-calculated dates as server truth.

## Implementation Decisions

- Preserve the existing single responsive dashboard composition and current `md` transition between stacked and two-column supporting cards.
- Determine ring placement from the responsive card layout rather than physical screen pixels, browser zoom, or device-pixel ratio.
- Keep the two supporting cards equal height when they share a row; allow natural height when stacked.
- Strengthen Course Progress hierarchy without changing its lifecycle states or making it actionable.
- Separate the course title from the progress summary and remove the duplicated completion count from the descriptive line.
- Keep the cyan course-progress bar. Use normal foreground emphasis for its percentage and supporting hierarchy for its label and completion count.
- Introduce a reusable circular percentage visualization with a theme-aware green accent arc, muted neutral track, neutral center content, and no animation.
- The ring accepts populated, genuine-zero, unavailable, refreshing, and refresh-failure content without changing its outer dimensions.
- Use a visible three-option segmented control for 7D, 30D, and 90D rather than a dropdown.
- Give each segment a minimum 44-pixel touch target, equal width on narrow screens, accessible full-period naming, visible focus, and a selected state that does not depend on color alone.
- Initialize the selected period to 30 days for every new dashboard visit. Do not persist the selection in URL state or local storage.
- Pass the selected period to the existing stats endpoint through its supported day query parameter.
- Include the selected day count in the stats query key so TanStack Query caches each period independently during the visit.
- Keep the initial 30-day stats request inside the existing coordinated dashboard snapshot.
- After initial success, changing the period creates a Make Rate-only refresh boundary. Course Progress and Last Session remain rendered and unchanged.
- During a timeframe refresh, keep the ring track, card copy, and segmented control in place; replace the center percentage with a small spinner and mark the card busy.
- If the selected-period refresh fails after the existing automatic retry, keep the selected segment active, show **Couldn’t load this period**, and replace the ring percentage with a Retry control.
- Keep automatic retry at one retry, meaning two total attempts, for initial and timeframe stats requests.
- Use normalized period session count to distinguish a genuine 0% from a period with no sessions.
- Represent unavailable Make Rate data with **—**. Do not coerce absent or malformed percentages to zero.
- A brand-new enrolled player sees **Complete your first session to establish a make rate.**
- A selected period with no sessions sees **No sessions in this period.**
- Until authoritative API period metadata exists, the explanation and footer use **last N days** rather than browser-calculated exact dates.
- Remove maximum distance from the Last Session presentation while leaving unrelated session contracts unchanged unless later cleanup establishes they are unused elsewhere.
- Arrange Last Session as a stable two-by-two grid in the order Make rate, Putts, Date, Duration.
- Pair the four Last Session metrics with semantically appropriate icons using one consistent muted treatment.
- Keep unavailable fields in their grid positions as **—**. When no session exists, hide the grid and render intentional empty-state copy.
- Preserve the initial dashboard as one coordinated snapshot with its existing layout-level loading, automatic retry, whole-dashboard failure, and manual Retry behavior.
- Update initial skeletons to mirror the revised Course Progress hierarchy, circular Make Rate visual, segmented-control area, and four-field Last Session grid.
- Keep lifecycle derivation and raw API normalization at the existing dashboard view-model boundary.
- Add a stats query-options boundary that owns the period-aware query key, day parameter, request behavior, and shared retry policy.
- Keep this parent spec as one product contract, then split implementation into tracer-bullet issues before coding.
- Track authoritative period metadata as a separate, non-blocking backend investigation in the API repository. The investigation should resolve start/end semantics, timezone behavior, range inclusivity, custom day handling, backward compatibility, and backend tests.

## Testing Decisions

- Tests verify observable states and request behavior through public interfaces; they do not assert Tailwind class names, private helpers, SVG implementation details, or internal call order.
- Preserve the existing dashboard view-model factory as the highest presentation-state seam. Feed it course, enrollment, sessions, selected-period statistics, loading, and failure results, then assert normalized dashboard state and display data.
- Add one period-aware stats query-options seam exercised through TanStack Query's public query client. This seam proves request parameters, period-specific query keys, cache isolation, automatic retry, and failure behavior without mocking internal hook implementation.
- Extend view-model fixtures to cover Course Progress copy separation, populated Make Rate, genuine 0%, brand-new user, no sessions in the selected period, unavailable data, and stable Last Session fields.
- Exercise 7-, 30-, and 90-day query options and prove that revisiting a previously loaded timeframe reads the correct cached result rather than another period's data.
- Prove that an initial required stats failure contributes to the dashboard-level load-error state after retry exhaustion.
- Prove that a later selected-period failure is represented as a Make Rate-local error while previously loaded Course Progress and Last Session data remain available.
- Prove that Retry repeats the selected period rather than resetting to 30 days.
- Preserve tests that distinguish genuine zeroes from null or malformed aggregate and session metrics.
- Use browser verification for rendered hierarchy, ring placement, equal-height cards, icon treatment, touch targets, focus states, loading shapes, responsive behavior, and theme contrast.
- Browser verification covers phone, tablet, and desktop sizes in light and dark themes, including both sides of the existing stacked/two-column breakpoint.
- Browser verification covers populated, genuine-zero, unavailable, first-session, no-session-period, refreshing, refresh-failure, and dashboard-level failure states.
- Accessibility verification confirms meaningful ring labels, busy-state announcements, segmented-control naming and selection, keyboard operation, visible focus, Retry context, and minimum touch-target sizing.
- Focused dashboard tests, the production build, and a clean diff check are required before each implementation issue is considered complete.
- Existing dashboard view-model tests and query-client retry tests are the prior art for these seams.

## Out of Scope

- Returning exact period start and end dates from the backend in this frontend implementation.
- Calculating exact dates in the browser and presenting them as authoritative API dates.
- A new stats endpoint.
- Persisting timeframe selection across page visits.
- Trend arrows, improvement or decline comparisons, historical charts, or lifetime analytics.
- Make Rate ring animation.
- Course-card navigation, a dedicated practice route, or session-saving changes.
- Making Course Progress or Last Session actionable.
- Sidebar changes or broader application restyling.
- Backend schema migration.
- Removing normalized session fields solely because this presentation no longer displays them.
- Per-metric Last Session icon colors.

## Further Notes

- The product goal remains: tell the player what to do next in the course, then provide enough performance context to understand progress.
- The frontend work can ship with **Last 7 days**, **Last 30 days**, and **Last 90 days** labels before the backend metadata investigation completes.
- The backend investigation is related work, not a blocker for this frontend spec.
- This effort is intentionally one parent spec but is too broad for one implementation issue. Use the ticket-splitting flow to produce small, independently verifiable implementation issues with explicit blocking edges.
- Likely implementation slices are visual cleanup for Course Progress and Last Session, the Make Rate ring and responsive composition, period-aware query/cache behavior, card-local refresh and Retry states, and final integrated accessibility/responsive verification. Ticket boundaries remain the responsibility of the ticket-splitting step.

## See also

- [Issue #27 dashboard spec](https://github.com/NMasters52/DiscGolfLabs-Frontend/blob/dev/docs/Issue-Tickets/issue_27_spec.md) — original real-data dashboard contract and lifecycle decisions.
- [State management reference](https://github.com/NMasters52/DiscGolfLabs-Frontend/blob/dev/docs/STATE.md) — current TanStack Query keys and hooks.
- [Frontend patterns](https://github.com/NMasters52/DiscGolfLabs-Frontend/blob/dev/docs/frontend-patterns.md) — frontend implementation conventions.
