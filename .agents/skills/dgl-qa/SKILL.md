---
name: dgl-qa
description: Perform feature QA for Disc Golf Labs, update permanent Playwright E2E coverage, investigate browser failures, and verify free and paid user flows.
---

# DGL feature QA

Read the feature requirements and `docs/browser-qa-protocol.md`. Identify affected flows and observable pass conditions before execution. A request to QA a feature authorizes local test execution; do not require separate approval of a checklist. Publish or update GitHub issues only when requested.

1. Add or update permanent Playwright specs under `e2e/` for the affected flows. Cover important behavior rather than every control.
2. Run relevant specs for `free` and `paid`. Use the dedicated John and Jane development accounts, never personal or production accounts. The paid project means course enrollment, not a real payment. Finish authentication setup before the test run; do not refresh states or run competing builds/suites during it. Refresh expired credentials with `npm run auth:setup`; do not print or commit `playwright/.auth/`.
3. Fix feature-caused failures and rerun until green. Distinguish stale assertions, environment problems, existing bugs, and feature regressions; do not weaken assertions to hide bugs.
4. Use `./scripts/dgl-browser.sh free|paid` for exploratory Playwright CLI testing. Snapshot before using element refs and after navigation or significant changes. Keep Playwright MCP as a secondary option for deeper interactive investigation. Restart Codex after registering it if its tools are unavailable.
5. Check desktop and mobile where relevant, including browser Back, Escape, focus return, reload, and layout overflow for changed navigation.
6. Inspect browser console and network errors. This CLI has no `network` command; use response listeners through `run-code`, test diagnostics, or traces. Attach diagnostic logs to test results. Expected injected errors need an explicit reason; unexpected app errors fail the check.
7. If exploration finds a bug, reproduce it, add a regression test, run it to confirm failure, fix the bug, then confirm the test passes. Retain the failure evidence and the successful rerun.
8. Verify persistence through the real API and reload, not only optimistic UI. Auth/enrollment checks use the real backend. Controlled response overrides are appropriate for errors and otherwise unreachable enrollment states; label those cases clearly.
9. Session recording tests may add putting sessions only for the dedicated development account. Run that flow serially to avoid competing writes. Do not alter enrollment or security settings just to reach a state; intercept responses for completed/locked-day variants.
10. Report requirements covered, commands and results, bugs found, changes, evidence paths, expected skips, and remaining concerns. A failed or unexecuted check is never a pass.

Start with `npm run test:e2e -- <affected specs> --workers=2`, then run the broader suite when warranted. Use `npm test`, `npm run test:routes`, build, and typecheck when relevant to fixes. Browser artifacts live in ignored `e2e/test-results/`, `e2e/playwright-report/`, and `output/playwright/`.

Use this workflow on the feature before adding more QA infrastructure. Improve instructions only when the run exposes a concrete problem.
