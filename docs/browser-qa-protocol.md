# Browser QA Protocol

> Status: **reference** · Part of: `docs/README.md` · Last verified: 2026-09-04 (QA #8–#12 run)

## Why

How an agent runs interactive browser QA against the local app and produces reviewable proof. Use it whenever an issue's acceptance criteria can only be verified in a real browser — routing/refresh/history, themes, Clerk panels, tab titles, responsive and keyboard behavior. Extracted from the issue #47 QA run; tool-agnostic by design.

## Accounts & environments

| Chrome profile | Clerk account | Tier                   | Use for                                 |
| -------------- | ------------- | ---------------------- | --------------------------------------- |
| `Nick`         | Nick          | unpaid (no enrollment) | free-tier access checks                 |
| `Nicholas`     | Nicholas      | paid                   | enrolled-content and persistence checks |

- App runs at `http://localhost:5173`
- Check that the app is running before starting it.
- Never sign out, change security settings, or mutate account state during QA. Navigation, theme selection, and reloads are fine.
- Every QA item names its profile up front; run it on that profile only.

## The loop

1. **Prepare** — confirm the branch matches the issue/PR and the worktree is clean. Read the issue's unchecked acceptance criteria, then the relevant code, to fill any gaps. Do not execute anything yet.
2. **QA list** — produce a numbered list. Every item states: which profile, the steps, and a **definition of pass** written as observable end-state claims. The user approves the list before execution begins.
3. **Per item, in order:**
   1. Restate the definition of pass for this item.
   2. Execute on the named profile.
   3. **Capture evidence first** (see standards below).
   4. Derive the verdict from the evidence — verdict is the _last_ step, never the first.
   5. Update the GitHub issue immediately (see sync rules) so `gh` state is always the source of truth.
4. **On FAIL** — file a sub-issue (recipe below), then continue with the next item.
5. **Session close** — reconcile and report (below).

## Evidence standards

Evidence is captured **before** the verdict. A check without its listed proof is `unverified`, not `pass`.

| Check type            | Required proof                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Navigation / URL      | final URL + accessibility-tree snapshot after the action                                                  |
| Visual / contrast     | full-page screenshot **and** element screenshot; measured contrast or computed styles, not "looked right" |
| Tab / page title      | runtime read of `document.title` via JS evaluation — a code grep alone is not evidence                    |
| Persistence           | state value captured before → after a full reload → after a cross-page round trip                         |
| Theme                 | computed color values of named elements in both appearances                                               |
| Keyboard / responsive | focus-order capture; screenshots at each required viewport size                                           |

Rules:

- **Enumerate the shell before passing a visual check.** Verify _every_ persistent shell element (sidebar items, sign-out, header), not just the subject of the test. (Lesson from QA #7: a Light-mode pass was declared, then the Sign Out label was found invisible in the proof image.)
- **Reachable focus is not visible focus.** A control can be tab-reachable and `:focus-visible` yet render no indicator. Capture the computed-style delta (background, outline, box-shadow) between keyboard-focused and resting states — `document.activeElement` order alone would have passed Sign Out in QA #12, whose focused styles were byte-identical to resting. Third-party components may indicate focus by background instead of ring (Clerk nav does) — that counts; nothing counts only if the delta is empty.
- **Playwright pins `prefers-color-scheme: light` by default.** Every page a Playwright-driven browser opens emulates Light, so OS-appearance checks (System theme) silently test a fake Light device — flips never reach the page and reloads don't help. Call `page.emulateMedia({ colorScheme: null })` before measuring; the MCP exposes no emulateMedia tool, so route it through `browser_run_code_unsafe`. Probe `matchMedia('(prefers-color-scheme: dark)')` after disabling to confirm the OS signal is real. (Lesson from QA #9: the app was silently tested against a fake Light device while macOS was Dark.)
- **Negatives need runtime assertions.** "No route title exists" requires reading the live page, not only searching the code.
- **Re-snapshot before clicking a captured ref.** After a navigation or re-render, old element refs fail silently — the click "succeeds" and nothing happens. Confirm the click landed (URL or heading changed) before building on it. (Lesson from QA #11: a sidebar ref captured pre-navigation clicked through without navigating.)
- **Simulate a clean first visit with a fresh incognito context, not by clearing storage.** `page.context().browser().newContext()` works inside the MCP (via `browser_run_code_unsafe`); clone the session cookies in with `addCookies` so the visit is authenticated without mutating account state, disable color-scheme emulation on the new page, and pass `recordVideo` at context creation — per-context video is the only way to record a page the MCP doesn't own. (Lesson from QA #10.)
- **Flip macOS appearance programmatically and restore it.** `osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to …'` — expect a one-time automation permission prompt, sleep ~1.5 s before probing, and return the OS to its pre-test state at the end of the item. (Lesson from QA #9.)
- Store artifacts under `.scratch/qa/<issue>/` (gitignored) and reference them from the issue comment: filename + one-line description.
- **Artifact paths are inconsistent: only page/console snapshot artifacts honor `--output-dir`.** Screenshot and video filenames given to the named tools resolve against the MCP server's cwd (`$HOME`) — QA #8/#11 proof images initially landed in `$HOME` and had to be moved. Either pass absolute paths, or glob `$HOME` for the files after capture and move them into `.scratch/qa/<issue>/`.

## Sub-issue recipe (on FAIL)

1. **Dedupe first** — list the parent's existing sub-issues (`gh api repos/<org>/<repo>/issues/<n>/sub_issues`) and search open issues before creating anything.
2. Create a **native sub-issue** of the parent, labeled `ready-for-agent`.
3. Body structure (see #55 and #56 as the standard):
   - **Problem** — what failed, with the observed evidence from the run.
   - **Affected area** — concrete files/symbols.
   - **Proposed solution** — the fix approach, including what _not_ to break.
   - **Acceptance criteria** — checkboxes, always ending with "browser QA re-run passes on the original failing check."
   - **Parent issue** — "Sub-issue of #N."

## Issue sync rules

- Maintain granular QA checkboxes in the issue body — one per QA item, not just the broad acceptance criteria.
- Check an item only after an evidence-backed pass; record FAIL evidence inline on the item (bold `**FAIL:**` + specifics).
- A broad acceptance criterion is checked only when _all_ subsumed QA items pass.

## Session close

1. **Reconcile** — verify every side effect actually landed: sub-issue count matches sub-issues created, checklist state matches the verdict table. Never report completion on faith.
2. **Report** — a table of item → verdict → evidence pointer, open failures, sub-issues created, and what remains.

## Tooling

Requirements for any browser-control driver, against a real Chrome profile: navigate, click/focus, accessibility-tree snapshot, full-page and element screenshots, JS evaluation, console and network capture, and multi-profile switching. The protocol does not depend on a specific tool.

### Current setup — Playwright MCP (researched 2026-09-03)

One MCP server instance per account, each with its own persistent profile dir. Log in to Clerk once per profile; the session persists on disk.

```bash
claude mcp add qa-nick -s user -- npx @playwright/mcp@latest --browser chrome \
  --user-data-dir="$HOME/.qa-chrome/nick" \
  --caps=testing,storage,devtools,network --save-session \
  --output-dir="$HOME/.qa-chrome/artifacts"

claude mcp add qa-nicholas -s user -- npx @playwright/mcp@latest --browser chrome \
  --user-data-dir="$HOME/.qa-chrome/nicholas" \
  --caps=testing,storage,devtools,network --save-session \
  --output-dir="$HOME/.qa-chrome/artifacts"
```

Register the same servers with `codex mcp add` for Codex CLI/Desktop (shared `~/.codex/config.toml`; set `startup_timeout_sec = 30` there or slow npx servers get silently dropped). Complement: `chrome-devtools-mcp` for Lighthouse a11y audits, Core Web Vitals, and heap snapshots.

Rules:

- **Never `--extension` mode** — it hangs on multi-profile macOS Chrome (playwright-mcp#1732) and there is no `--profile-directory` fix.
- **Never point `--user-data-dir` at the real Chrome profile** — the dir locks while Chrome runs; use dedicated dirs under `~/.qa-chrome/`.
- Two server instances must never share a profile dir.
- `--caps` is comma-separated with no spaces; core tools (navigate/click/snapshot/screenshot/eval/console/network) are always on.
- `--save-session` writes a replayable Trace Viewer zip per session (`npx playwright show-trace <file>.zip`) — the forensic fallback when a run dies mid-task.
- Video capture needs `npx playwright install ffmpeg` (one-time per machine). Without it, `browser_start_video` errors _after_ arming the recorder — call `browser_stop_video` to clear the stuck state before retrying. (Hit at QA #8.)
- OAuth round-trips (Clerk → Google → back) can orphan the MCP's page handle: subsequent calls fail with "No open pages available" and `browser_tabs` shows only `about:blank`. Re-navigate to recover; don't restart the server. Verify login state from cookies — `__session` (JWT with `sts: "active"`) plus `__client_uat`, and the JWT `sub` claim distinguishes the two accounts — not from page content. (Hit during the 2026-09-04 one-time logins.)
- `browser_run_code_unsafe` is the escape hatch for anything the tool surface lacks: `emulateMedia`, keyboard loops, viewport sweeps, fresh contexts, absolute-path screenshots. (Proven across QA #9–#12.)

### Hard proof beyond the MCP

No browser MCP does pixel diffs or visual regression. For durable, diffable proof: use the MCP assertion tools (`browser_verify_*` — each emits the equivalent Playwright spec line) and export `browser_storage_state` per account, then codify as Playwright specs with `expect(page).toHaveScreenshot()` baselines run per profile. MCP session = investigation + one-off proof; specs = repeatable proof that fails CI on drift.

## See also

- [`../AGENTS.md`](../AGENTS.md) — repo entry point for agents.
- [`auth.md`](auth.md) — Clerk auth wiring and route guards (what the panels under test are).
- [`PAGES.md`](PAGES.md) — route inventory (`/app/settings/*` under test).
