# Browser QA protocol

Run commands from `DiscGolfLabs-Frontend`. Markdown links resolve relative to this file.

## Accounts and restrictions

| Project | Dedicated development account | Enrollment | Local credentials |
| --- | --- | --- | --- |
| `free` | John Doe | Not enrolled | `playwright/.auth/free.json` |
| `paid` | Jane Doe | Enrolled | `playwright/.auth/paid.json` |

`paid` means course enrollment, not a real payment. Never use personal or production accounts, change security settings, or mutate enrollment to reach a test state. Use clearly labeled response overrides for errors and otherwise unreachable enrollment/day variants. Verify normal authentication and enrollment against the real backend.

Session-recording checks may add putting sessions for Jane. Run these writes serially, separate from other runs using the same account. Credential files are ignored and must not be printed, copied, or committed.

## Setup and test commands

Check listeners on ports 5173 and 8000 and reuse appropriate servers as described in [AGENTS.md](../AGENTS.md#local-development-servers). The frontend is `http://localhost:5173`; the backend is required for real API checks.

The harness is `playwright.config.ts` plus `e2e/`. Both account states must exist. Create missing or expired states with `npm run auth:setup` before a run. Do not refresh auth or run competing builds/suites during it. Local specs use `/usr/bin/chromium` when available, or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; CI uses bundled Chromium.

```bash
# Focused specs, both profiles. Replace <affected specs> with file paths.
npm run test:e2e -- <affected specs> --workers=2
# One profile, when a check is specific to it.
npm run test:e2e -- e2e/desktop-course-access.spec.ts --project=free --workers=2
# Session-writing flow, run separately.
npm run test:e2e -- e2e/core-flows.spec.ts --project=paid --workers=1 -g 'paid user records a putting session'
# Broader coverage when warranted.
npm run test:e2e -- --workers=2
```

Use `npm test`, `npm run test:routes`, `npm run build`, and `npm run typecheck` when relevant to a fix. Course coverage starts in `e2e/desktop-course-access.spec.ts`, `e2e/courses-flow.spec.ts`, and `e2e/mobile-nav.spec.ts`; inspect the specs for account-specific skips.

## Exploratory browser commands

Check the CLI prerequisites:

```bash
command -v npm
command -v npx
test -x "${PLAYWRIGHT_CLI:-${CODEX_HOME:-$HOME/.codex}/skills/playwright/scripts/playwright_cli.sh}"
```

The wrapper requires that external executable. If installed elsewhere, set `PLAYWRIGHT_CLI` to its absolute path. If unavailable, report it and continue independent checks through the in-repo E2E harness when its dependencies, browser, servers, and auth states are available. Missing execution prerequisites block the affected checks, not inspection of requirements or existing specs.

Open the selected account before sending session commands:

```bash
./scripts/dgl-browser.sh free
./scripts/dgl-browser.sh paid
./scripts/dgl-browser.sh paid snapshot
./scripts/dgl-browser.sh free goto http://localhost:5173/app/courses
```

These use isolated `dgl-free` and `dgl-paid` sessions. The open command refreshes missing/expired states, loads authentication, and navigates to the dashboard. Continue CLI commands through the same wrapper. `PLAYWRIGHT_BASE_URL` overrides the wrapper's app URL; the E2E harness uses localhost:5173.

Capture fresh element refs after navigation or re-render, and confirm each action reached its expected URL, heading, or state. Use Playwright MCP as a secondary investigation tool when needed, with the same dedicated-account restrictions.

Inspect console errors, page exceptions, and failed API responses. Use CLI `run-code` response listeners, test diagnostics, or traces for network capture; this CLI has no `network` command. Attach diagnostics to test results. Unexpected app errors fail the check; explain deliberately injected errors.

## Evidence requirements

Collect evidence before the verdict. Missing proof, blocked checks, and unexecuted checks are `unverified` or `blocked`, never `pass`.

| Check | Required proof |
| --- | --- |
| Navigation | Final URL and accessibility snapshot after the action |
| Visual / contrast | Full-page and element screenshots; computed styles or measured contrast |
| Page title | Runtime `document.title` |
| Persistence | State before, after full reload, and after a cross-page round trip; real API confirmation |
| Theme | Computed colors of named elements in each relevant appearance |
| Keyboard | Focus order and visible focus indicator, including computed-style changes |
| Responsive | Screenshots at required viewport sizes and overflow checks |

For changed navigation, cover desktop/mobile as relevant, Back, Escape, focus return, reload, and overflow. For shell visual checks, enumerate persistent sidebar items, sign-out, and header. Keyboard reachability alone does not prove visible focus; capture changes in background, outline, or box-shadow. Negative claims also require runtime assertions.

Use a fresh browser context for first-visit checks, loading only the needed dedicated authentication and explicitly controlling theme/media. Do not clear a shared session's storage. Configure video when creating the context if required.

### Theme checks

- For explicit Light and Dark preferences, select the app preference and measure colors. Existing specs use `openWithTheme` in `e2e/helpers.ts`; testing the preference control itself requires clicking it.
- For System, select System, then use `page.emulateMedia({ colorScheme: "light" })` and `{ colorScheme: "dark" }` in CLI `run-code` or a spec. Confirm `matchMedia('(prefers-color-scheme: dark)')`, resolved app theme, and computed colors after each switch. Media emulation does not override a saved Light/Dark preference; the harness defaults to light media.
- Only if acceptance criteria require actual host-appearance integration, disable emulation with `colorScheme: null` and capture the host signal.

### Artifacts

| Source | Ignored output location |
| --- | --- |
| CLI exploration | `output/playwright/`; relative CLI paths resolve here |
| Specs and diagnostics | `e2e/test-results/` |
| HTML test report | `e2e/playwright-report/` |
| Manual proof | `.scratch/qa/<issue-or-feature>/` |

Use behavior assertions for regressions; add `expect(page).toHaveScreenshot()` baselines under `e2e/visual/` when visual regression coverage is needed. Reference artifact filenames and what they prove in the final report.

## Issue reporting, only when requested

Keep results local unless the user requests GitHub issue reporting. When requested:

1. Dedupe failures against open issues and the parent's native sub-issues, using `gh api repos/<org>/<repo>/issues/<n>/sub_issues`.
2. Create needed native sub-issues labeled `ready-for-agent`. Include the observed problem/evidence, affected files/symbols, proposed solution, acceptance checkboxes ending with the original browser check passing, and the parent issue.
3. Maintain one QA checkbox per item in the issue body. Check only evidence-backed passes; record failure evidence inline. Check broad acceptance criteria only when all their checks pass.
4. Verify that issue/checklist updates landed, then report the item/verdict/evidence table, open failures, created sub-issues, and remaining work.

## References

- [Authentication](auth.md)
- [Route inventory](PAGES.md)
