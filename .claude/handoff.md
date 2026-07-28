# Handoff — Issue #17 Documentation Audit (Frontend)

> Temporary working doc. Compacts audit status so another agent/session can continue.
> **Start with the 3 sub-issues below.** Delete this file + `docs/_audit-issue17.html`
> once #17 is closed.

## Repos & numbers (don't confuse them)
- **Frontend** (`NMasters52/DiscGolfLabs-Frontend`): #17 (parent audit), #18/#19/#20 (bugs).
- **API** (`NMasters52/DiscGolfLabs-api`): #5–#16 (backend contracts), label `audit/backend-contract`.
- Audit source of truth: `docs/_audit-issue17.html` — 140 claims (95 PASS, 16 FAIL, 19 PARTIAL,
  12 backend-dependent, 3 likely bugs, 2 undocumented). Keep until done.

## Already DONE (don't redo)
- 12 backend claims → API #5–#16 (OPEN).
- 3 bugs → Frontend #18/#19/#20 (OPEN, sub-issues of #17).
- 2 undocumented layouts → documented in `docs/PAGES.md`.
- Doc-fixed: README (structure tree, `app/api/` list, colors), PAGES (layouts, route guards,
  landing 5 sections), STATE (waitlist hooks), COMPONENTS (WaitlistForm `source`, Putting
  type notes), auth.md (guard scope), frontend-patterns (colors, components.json),
  architecture (top-level components).
- Resolved/gone: `_to-consolidate.md` deleted; README "Codebase Statistics" removed;
  Framer Motion / ESLint no longer in README; STATE `useGameSessions` plural fixed.

## ▶️ NEXT — the 3 sub-issues (start here)
Each is the same shape: a doc contradicts code, but it's a real **code** bug. Per issue,
decide **code-fix (preferred) vs doc-only**, then apply + update the doc to match.

### #18 — `useCreateGameSession` doesn't invalidate `puttingGame.stats`
- Doc: `docs/STATE.md:152` claims it invalidates `gameSession.bySlug` **and** `puttingGame.stats`.
- Code: `app/queries/useCreateGameSession.js:15-19` — `onSuccess` invalidates ONLY `bySlug`.
- Fix (preferred): add `queryClient.invalidateQueries({ queryKey: queryKeys.puttingGame.stats() })`
  to `onSuccess` (key = `["putting-game","stats"]`, see `app/queries/keys.js`).
  (Alt: correct `STATE.md:152` to "bySlug only".)
- Verify: save a session → dashboard make-rate updates with no manual refresh; doc matches code.

### #19 — `/app` renders a blank page
- Doc: `docs/PAGES.md` says `/app` redirects to dashboard.
- Code: `app/routes/app/_index.jsx` is **0 bytes** (no redirect); mounted at `routes.ts:24-25`.
- Fix (preferred): `app/routes/app/_index.jsx` → `export default () => <Navigate to="/app/dashboard" replace />`.
  (Alt: correct PAGES.md to "empty index — redirect TODO".)
- Verify: signed-in visit to `/app` → lands on `/app/dashboard`.

### #20 — Inter loads but never applies
- Doc: `docs/frontend-patterns.md:8` "Typography: Inter"; README "Inter: Primary typeface".
- Code: `root.tsx:20-25` loads Inter via Google Fonts `<link>`, but `app/app.css` `@theme inline`
  (line 16) has **no `--font-sans`** and `body` has no `font-family` → falls back to system stack.
- Fix (preferred): add `--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;` inside
  `@theme inline` in `app.css`. (Alt: soften docs to "intended typeface".)
- Verify: computed `font-family` on `body` resolves to Inter. (Also set `--font-mono` if
  monospace is used for data/labels.)

## Then — gated doc gaps (land after the blockers settle)
- `docs/STATE.md` `overallMakeRate` → real shape is nested `overall.makeRate`; gated on
  **API #12**. (Also touches mock data + component reads.)
- `docs/STATE.md` `useCreateGameSession` payload wording → gated on **API #13** (request contract).
- Doc text for #18/#19/#20 itself lands here once each sub-issue is decided.

## Backend contracts that gate frontend docs
- **API #12** (`GET /api/stats` → nested `overall.makeRate`) and **API #13**
  (`POST /api/games/:gameSlug/session` request contract) are the two that block frontend docs.
- The rest of API #5–#11, #14–#16 are doc-only contracts (no frontend doc blocked).

## Closing #17 (from the report footer + acceptance criteria)
- [ ] 3 sub-issues decided + applied (#18/#19/#20)
- [ ] Gated doc gaps applied (after API #12/#13)
- [ ] Re-run verification pass: every claim re-checked against source, no contradictions
- [ ] Navigability check: single index + consistent per-doc template; "find the answer" on 3–5 samples
- [ ] Delete `docs/_audit-issue17.html` **and** `.claude/handoff.md`
- Done when: navigable; docs explain *why>what*; no known contradictions; backend claims triaged separately.
