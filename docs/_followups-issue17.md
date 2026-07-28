# Issue #17 Audit — Open Follow-ups

> Temporary audit artifact for the **Issue #17** documentation audit. Companion to `_audit-issue17.html`.
>
> This file catalogs the **other** still-open issues found during the audit — i.e. everything **not** already covered by the three code sub-issues **#18 / #19 / #20**, which are tracked separately and intentionally excluded here.
>
> **Delete this file once every item below is resolved.** Each entry has been re-verified against source on disk (paths + line numbers cited).

## Table of Contents

1. [No `docs/` index](#1-no-docs-index)
2. [Dead cross-link: `routes.md` in `project-overview.md`](#2-dead-cross-link-routesmd-in-project-overviewmd)
3. [Dead references: `_to-consolidate.md` in `frontend-patterns.md`](#3-dead-references-_to-consolidatemd-in-frontend-patternsmd)
4. [Empty misspelled directory `docs/decsions/`](#4-empty-misspelled-directory-docsdecsions)
5. [Inconsistent per-doc templates](#5-inconsistent-per-doc-templates)
6. [Triplicated `app/` structure tree (drift risk)](#6-triplicated-app-structure-tree-drift-risk)
7. [BONUS (code, flag only): `@clerk/clerk-react` vs `@clerk/react-router`](#7-bonus-code-flag-only-clerkclerk-react-vs-clerkreact-router)
8. [GATED: flat `overallMakeRate` vs nested `overall.makeRate`](#8-gated-flat-overallmakerate-vs-nested-overallmakerate)
9. [GATED: `useCreateGameSession` request payload wording](#9-gated-usecreategamesession-request-payload-wording)
10. [Verified as already-resolved / non-issue](#10-verified-as-already-resolved--non-issue)

---

## 1. No `docs/` index

**Issue:** `docs/` has no entry point — no `README.md` or `index.md` — so a reader landing in the directory has no map of the nine docs inside.

**Evidence:** `ls docs/` shows only `COMPONENTS.md`, `ENV.md`, `PAGES.md`, `STATE.md`, `architecture.md`, `auth.md`, `frontend-patterns.md`, `project-overview.md`, plus the `_audit-issue17.html` companion. No `README.md` / `index.md` exists.

**Proposed solution:** Add `docs/README.md` with a one-line entry per doc (group by: orientation → `project-overview.md`, `architecture.md`; reference → `PAGES.md`, `COMPONENTS.md`, `STATE.md`, `ENV.md`; stubs → `auth.md`, `frontend-patterns.md`). Keep it to a flat list with a sentence each; no deep nesting.

**Status:** `Unblocked`

---

## 2. Dead cross-link: `routes.md` in `project-overview.md`

**Issue:** `project-overview.md` links to a `routes.md` that does not exist; the routes doc is actually `PAGES.md`.

**Evidence:** `docs/project-overview.md:27`

```
See also: `architecture.md`, `frontend-patterns.md`, `routes.md`, `auth.md`.
```

`ls docs/routes.md` → `No such file or directory`. The routes documentation lives in `docs/PAGES.md` (`# Pages & Routes`, `PAGES.md:1`).

**Proposed solution:** In `docs/project-overview.md:27`, replace `` `routes.md` `` with `` `PAGES.md` ``.

**Status:** `Unblocked`

---

## 3. Dead references: `_to-consolidate.md` in `frontend-patterns.md`

**Issue:** `frontend-patterns.md` points twice to a `_to-consolidate.md` scratch file that was never created (or was removed).

**Evidence:** `docs/frontend-patterns.md:3`

> …Convention candidates salvaged from the removed `.clinerules/` setup live in [`_to-consolidate.md`](_to-consolidate.md); fold them in here over time.

and `docs/frontend-patterns.md:21`

> *(Convention candidates to fold in live in [`_to-consolidate.md`](_to-consolidate.md).)*

`ls docs/_to-consolidate.md` → `No such file or directory`.

**Proposed solution:** Either (a) create `docs/_to-consolidate.md` and move any salvaged `.clinerules/` conventions into it, or (b) if no conventions survive, delete both callouts in `frontend-patterns.md:3` and `:21` and inline whatever is canonical directly into the doc. Prefer (b) unless the scratch content is known to exist somewhere.

**Status:** `Unblocked`

---

## 4. Empty misspelled directory `docs/decsions/`

**Issue:** `docs/decsions/` is an empty directory whose name is a typo of "decisions".

**Evidence:** `ls -la docs/decsions/` lists only `.` and `..` (zero files). Created `Jul 25 06:53`, never populated.

**Proposed solution:** Remove it (`rmdir docs/decsions`). If ADRs / decision records are actually intended, recreate as `docs/decisions/` (correctly spelled) with a `README.md` describing the ADR convention before adding records. Do not leave the misspelled empty dir in place.

**Status:** `Unblocked`

---

## 5. Inconsistent per-doc templates

**Issue:** The eight docs use three different header conventions, so there is no single place a reader expects to find a doc's status, type, or navigation.

**Evidence:**

- **Stubs** carry a `> Status: **stub**` banner:
  - `docs/architecture.md:3` — `> Status: **stub** — fill in as we build…`
  - `docs/auth.md:3` — `> Status: **stub**.`
  - `docs/frontend-patterns.md:3` — `> Status: **stub** — conventions to follow…`
- **Reference docs** use a bare `# Title` followed by a `---` rule:
  - `docs/STATE.md:1` `# State Management` … `:5` `---`
  - `docs/PAGES.md:1` `# Pages & Routes` … `:5` `---`
  - `docs/COMPONENTS.md:1` `# Components` … `:5` `---`
- **`docs/ENV.md`** has neither: `# Environment Variables` (`:1`) is followed directly by the variables table (`:3`), with no status line and no rule.

**Proposed solution:** Adopt one lightweight header for every doc and retrofit the eight existing files:

```markdown
# <Title>

> Status: **stub** | **reference** | **archive**   <!-- one of -->
> Part of: `docs/README.md`
```

…and a shared **See also** footer (a short nav list) at the bottom of each doc. Keep the `# Title` + `> Status:` lines uniform; drop the now-meaningless `---` rule or apply it consistently. `ENV.md` is the minimal case to fix (add a status line + footer).

**Status:** `Unblocked`

---

## 6. Triplicated `app/` structure tree (drift risk)

**Issue:** The `app/` folder structure is described in three independent places at three different altitudes, so edits in one silently drift from the others.

**Evidence:**

- `README.md:52-121` — the most detailed tree: enumerates individual files under `api/` (`checkout.js`, `course.js`, `enrollment.js`, `games.js`, `user.js`, `waitlist.js`), every `components/landing/*` file, every `queries/*` hook, etc.
- `docs/architecture.md:13-22` — a `## Layers` table mapping folder → responsibility (`app/routes/`, `app/components/`, `app/game/`, `app/queries/`, `app/api/`, `app/hooks/`, `app/lib/`).
- `CLAUDE.md` (`## Layout`) — a condensed tree that explicitly says *"see docs/architecture.md for detail"*.

The three overlap on the folder list but disagree on granularity (e.g. README lists `api/checkout.js` et al.; the other two stop at the folder).

**Proposed solution:** Pick **one** source of truth and have the others link. Recommended: keep the detailed tree in `docs/architecture.md` (or a new `docs/structure.md`), trim `README.md` to a one-paragraph overview + a link, and leave `CLAUDE.md` as a pointer (it already defers). Run a quick diff of all three against the live `app/` tree as part of the fix — at least the `README.md` file list is a drift hazard.

**Status:** `Unblocked`

---

## 7. BONUS (code, flag only): `@clerk/clerk-react` vs `@clerk/react-router`

**Issue:** `useCompleteDay.js` (and one route) pull `useAuth` from the wrong Clerk package — every other query/route uses the React-Router-aware `@clerk/react-router`.

**Evidence:**

- `app/queries/useCompleteDay.js:2`

  ```js
  import { useAuth } from "@clerk/clerk-react";
  ```

- Every sibling query uses the other package:
  - `app/queries/useEnrollment.js:2` → `@clerk/react-router`
  - `app/queries/useGameSession.js:2` → `@clerk/react-router`
  - `app/queries/usePuttingGameStats.js:2` → `@clerk/react-router`
  - `app/queries/useCreateGameSession.js:3` → `@clerk/react-router`
  - `app/queries/useMe.js:2` → `@clerk/react-router`
  - `app/root.tsx:11` (`ClerkProvider`) → `@clerk/react-router`

- **Same inconsistency elsewhere (bonus):** `app/routes/checkout/success.jsx:5` also imports from `@clerk/clerk-react`.

`@clerk/clerk-react` is not in `package.json`'s direct deps (only `@clerk/react-router`, `@clerk/themes` are), so these imports resolve via a transitive dep — fragile.

**Proposed solution:** Out of audit scope — **flag only, do not fix here.** When the code sub-issues are touched, change both `app/queries/useCompleteDay.js:2` and `app/routes/checkout/success.jsx:5` to `import { useAuth } from "@clerk/react-router";` and verify `getToken()` behaves identically. (React-Router build wires `@clerk/react-router` into the router context; mixing packages can yield a `getToken` that never resolves.)

**Status:** `Unblocked — but out of audit scope (flag only)`

---

## 8. GATED: flat `overallMakeRate` vs nested `overall.makeRate`

**Issue:** The doc, the mock data, and `OverallStatsCard` all assume a **flat** `overallMakeRate` field, while the live dashboard reads a **nested** `overall.makeRate` shape — so at least one side is wrong relative to the backend.

**Evidence:**

- **Flat (doc + mock + card):**
  - `docs/STATE.md:120` — `**Returns:** stats object with \`distanceBreakdown\`, \`overallMakeRate\`, etc.`
  - `app/components/dashboard/data.ts:16` — `overallMakeRate: 0.58,`
  - `app/components/dashboard/cards/OverallStatsCard.tsx:6` — `const { overallMakeRate, personalBest } = mockUser;`
- **Nested (the UI that consumes the real API response):**
  - `app/components/dashboard/DesktopDashboard.tsx:20` — `const makeRate = stats?.overall?.makeRate || 0;` (and `:21` `stats?.overall?.totalPuttsMade`, `:22` `stats?.overall?.sessionCount`, `:23-24` `stats?.streaks.*`, `:25` `stats?.highlights?.weakestDistance`).

The UI is clearly written against a nested `overall` / `streaks` / `highlights` envelope; the doc + mock + `OverallStatsCard` predate it.

**Proposed solution:** Cannot finalize until the backend shape is confirmed. Once confirmed, align all three flat sites to the nested envelope (or, if the backend really is flat, fix `DesktopDashboard.tsx` instead). Expected: update `STATE.md:120` to describe `overall.makeRate`, `overall.totalPuttsMade`, `overall.sessionCount`, `streaks.currentStreak`, `streaks.longestStreak`, `highlights.weakestDistance`, `comparison.changePercentage`; rewrite `data.ts` mock to match; rewire `OverallStatsCard` to read from the same nested object the dashboard uses.

**Status:** `Gated on backend (API #12)` — confirm `GET /api/stats` returns nested `overall.makeRate` (and the `streaks` / `highlights` / `comparison` siblings) before touching the frontend/doc.

---

## 9. GATED: `useCreateGameSession` request payload wording

**Issue:** The `useCreateGameSession` section of `STATE.md` conflates the **hook's** argument with the **request payload**, so the documented "params" don't match the signature and the payload shape can't be trusted until the backend contract is confirmed.

**Evidence:** `docs/STATE.md:125-150`

```js
const { mutate, isPending, isError } = useCreateGameSession(gameSlug);
```

followed by a param table (`STATE.md:133-136`) listing **both** `gameSlug` and `courseId` as required params of the hook — but the signature only takes `gameSlug`. Then the usage example (`STATE.md:142-149`) passes the body inline:

```js
mutate({
  gameSlug: "putting-course",
  courseId: "abc123",
  dayNumber: 1,
  putts: [...],
  finalDistance: 25
});
```

Cross-check against source: `app/queries/useCreateGameSession.js` defines `useCreateGameSession(gameSlug)` and forwards a separate `payload` to `createGameSession(gameSlug, payload, token)` — so `gameSlug` is a hook/path param and `courseId` is a **payload field**, not a hook param. The doc's table is wrong on its face; whether the listed payload fields (`dayNumber`, `putts`, `finalDistance`) are the real backend contract is what's gated.

> Side note (rendering, not gated): `STATE.md:54` has a stray literal `</section>` tag inside the `useEnrollment` block, and `:138`/`:150` use a malformed ```` ```` ```` fence. Worth fixing in the same pass.

**Proposed solution:** Rewrite the section so the **hook signature** table lists only `gameSlug`, and a separate **Request payload** table documents the body fields sent to `POST` (the `mutate({...})` argument). Field names/types must be confirmed against `DiscGolfLabs-api` before publishing. Fix the stray `</section>` and the broken fence while editing.

**Status:** `Gated on backend (API #13)` — confirm the create-game-session request payload shape (`courseId`, `dayNumber`, `putts`, `finalDistance`, and any required fields like `gameSlug`) against the API before rewriting the doc.

---

## 10. Verified as already-resolved / non-issue

Every candidate on the audit list was checked against current source. **None were rejected** — all eight (items 1–9 above, with 7 and 8 being multi-part) reproduced on disk with the cited line numbers. Nothing was omitted.

One scope note rather than a rejection: candidate 7 surfaced a **second** site with the same Clerk-package mistake (`app/routes/checkout/success.jsx:5`) that was not on the original candidate list; it is flagged inside section 7 rather than dropped.
