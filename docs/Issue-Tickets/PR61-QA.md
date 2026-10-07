# Feature 61 QA, 2026-10-07

Requirements: [PR #61](https://github.com/NMasters52/DiscGolfLabs-Frontend/pull/61), [missing coverage #62](https://github.com/NMasters52/DiscGolfLabs-Frontend/issues/62), and the local [review checklist](PR61.md).

The workflow was exercised against the local frontend at localhost:5173 and its configured development API, with dedicated Clerk accounts John, free, and Jane, enrolled. No real checkout or payment was performed. Session-recording tests create real practice sessions for Jane.

## Coverage

| Flow | Proof |
| --- | --- |
| Anonymous app access and development email sign-in | `e2e/core-flows.spec.ts`, real Clerk UI and session user ID |
| Free and enrolled dashboard state | `e2e/core-flows.spec.ts`, reload and course-home round trip |
| Courses index and course home | `e2e/courses-flow.spec.ts`, real API enrollment |
| Free preview and lesson authorization | Course-home locked rows and marketing redirect |
| Starting lessons and completed-course review | Course CTA and learn entry; completed response override for repeatability |
| Locked days | Real enrolled identity with controlled day-1 response; day-5 URL redirects to day 1 |
| Session recording and progress | 30 makes, real POST 201, session count increases, reload and dashboard 30/30 and 35ft |
| Unknown slug and `/app/courses/learn` | Not-found state with return link and no Retry |
| Empty course list | Explicit empty API response |
| Course-home outage | Injected 503, error state, Retry restores real course data |
| Access sheet dismissal | Escape and Back restore card focus and consume the URL entry |
| Mobile and desktop | Feature-specific flows at 390px and 1440px; existing mobile suite at 320px and breakpoint widths |
| Browser errors | Core-flow console/page exceptions and API failures attached as `browser-errors`; CLI console and reload API inspection |
| Narrow putting progress | 320px regression with a fixed session response; actual saved-session CLI reproduction |

## Bug found and fixed

At 320px, putting progress expanded document width to 385px. The native progress bar's intrinsic width contributed to the grid's automatic minimum track width. `PuttingProgressView.jsx` now uses a `minmax(0, 1fr)` grid track and allows the progress bar to shrink. The first bar-only attempt was insufficient; the regression remained red until the grid track was fixed.

The regression was run before the fix and failed with `Expected <= 320, Received 385`. It passed after the fix. The original CLI reproduction also measured document width 320 after reload. No clipping or overflow hiding was added.

## Workflow findings

- Existing configuration expected absent Chrome. The suite and MCP now use installed Chromium; CI still uses bundled Chromium.
- Two old assertions encoded stale assumptions: an open access sheet now adds `?course=...`, and Jane begins at day 1, so requesting locked day 2 correctly redirects. Assertions now match the intended flow, with separate locked-day coverage.
- The suite lacked a Linux screenshot baseline. The generated sidebar image was visually inspected and retained; the paid comparison passed against the same account-independent baseline.
- Auth state refresh and tests should run sequentially. Finish auth setup before starting the suite; avoid overlapping full runs or builds with browser tests. One intermediate run timed out waiting for the dashboard mobile shell while other QA/build work overlapped. The cause is unconfirmed; retain this as a possible initialization flake if it recurs. The final run determines the result.
- The CLI installed here has no `network` command. Inspect API responses with `run-code` or test listeners, and preserve traces when needed.
- Keep completed and locked-day variants controlled instead of changing Jane's durable enrollment. Keep session-persistence coverage on the real API. Layout-only regressions use a fixed session response so they also work with a fresh account.

## Validation and evidence

Final E2E run: `npm run test:e2e -- --workers=2` passed with 126 passed, 24 expected account-specific skips, and 0 failures.

`npm test`, `npm run test:routes`, production build, skill validation, and `git diff --check` passed. Typecheck reports existing TS7016 declarations missing for legacy JS/JSX routes and queries; no diagnostics name the new E2E files or modified progress component.

Local evidence lives in ignored `output/playwright/feature-61/`: final E2E log, failing and passing overflow logs, build, typecheck, unit and route logs. Screenshots are `output/playwright/feature-61-paid-mobile.png`, `feature-61-paid-320-fixed.png`, and `feature-61-free-mobile-sheet.png`. Playwright's latest HTML report and failure artifacts live under `e2e/playwright-report/` and `e2e/test-results/`.

Playwright MCP was registered and verified through actual MCP initialize and browser navigation. Its tools are available to subsequent Codex sessions. The repo QA skill is `.agents/skills/dgl-qa/SKILL.md`, linked from `AGENTS.md`.

GitHub issues were read for requirements. No issue changes, commits, pushes, or PR changes were made. No further QA infrastructure was added after this feature trial.

## Completion review, 2026-10-07

Standards and spec reviews found two QA gaps, both corrected: diagnostics now observe the separate anonymous/authentication pages, and the test-user wizard invokes a frontend-owned setup script rather than an untracked backend script. The setup script reuses the sibling API's installed dependencies and models, and requires a Clerk development secret key. Its database-writing setup was not rerun because the dedicated accounts already exist.

Browser checks for #67 and #72 passed at 390px and 1440px in both light and dark themes. Locked rows and their ancestors have opacity 1. Titles measure 10.01:1 contrast on light cards and 13.07:1 on dark cards. First-row top and last-row bottom padding are 0px; middle rows have 10px top and bottom padding. Full-page and element images are `output/playwright/completion-rows-{light,dark}-{390,1440}-{full,element}.png`; computed styles are recorded in `output/playwright/feature-61/completion-row-proof.log`. The inspected browser console has no errors on those course-home checks.

The first completion rerun was interrupted after connection-refused failures exposed a stopped local API. Both development servers were then started before the final rerun.

Completion E2E rerun: `npm run test:e2e -- --workers=2` passed with 126 passed, 24 expected skips, zero failures in 3.4 minutes. Log: `output/playwright/feature-61/completion-e2e.log`.

Completion checks: `npm test`, `npm run test:routes`, production build, and `git diff --check` passed. Typecheck reports 70 existing TS7016 diagnostics, with no other diagnostic code. Setup imports and its production-key rejection were verified without database writes. Logs use the `completion-{unit,routes,build,typecheck}.log` names in the same evidence directory.
