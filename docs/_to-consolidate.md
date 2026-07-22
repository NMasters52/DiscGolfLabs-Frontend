# _To Consolidate — salvaged conventions from `.clinerules/`

> **Status: holding pen, not canonical.** Captured during issue #14 cleanup when the
> superseded Cline setup (`.clinerules/` + `.clineignore`) was removed. This file collects
> the bits that still looked useful so they aren't lost. **Review and fold each section into
> its eventual home (noted below), then delete this file.** Nothing here is enforced yet.

Source files removed in #14: `MERN-rules.md`, `DiscGolfLab-agents/FEATURE_{DESIGN,CODER,AUDITOR,DOCS}.md`, `DiscGolfLab-agents/DOC_ARCHITECT.md`. The four `FEATURE_*` agent flows + FDD templates were **not** salvaged — they duplicated the Claude `feature` / `feature-dev` / `code-review` / `qa` / `verify` skills and were written against stale paths (`src/features/...`) and stale design tokens (neon green `#39FF14` / Barlow Condensed — not this repo's Metallic Blue / Teal / Cyan + Inter).

---

## Frontend conventions (from `MERN-rules.md`)
**Eventual home: `docs/frontend-patterns.md`**

- Components as arrow functions; group imports: React first → external libs → internal components → styles.
- Keep logic out of JSX — extract complex logic into custom hooks (e.g. `useThingLogic.ts`).
- Prefer local component state; reach for global state only for truly global data (Auth, Theme).

> Verify against the actual codebase before adopting — some of this is generic and may not match current `.tsx`/`.jsx` style.

---

## Backend / API conventions for the split repo (from `MERN-rules.md`)
**Eventual home: `DiscGolfLabs-api` docs — this is the frontend repo, these belong over there.**

- **Pattern:** Controller–Service–Model.
- **Middleware:** global error handler + `try/catch` wrapper for async routes.
- **Security:** sanitize inputs with `express-validator`; send `helmet` headers.
- **MongoDB:** Mongoose schemas with strict typing; never `any` for document types.
- **API design:** RESTful `/api/v1/resource`; consistent JSON shape `{ "success": true, "data": {}, "message": "" }`.

---

## Process conventions (from `FEATURE_DOCS.md`)
**Eventual home: `CLAUDE.md` or `docs/frontend-patterns.md`**

- **Conventional commits** — `<type>(<scope>): <summary>`; types `feat`/`fix`/`refactor`/`docs`/`style`/`test`/`chore`.
  - Summary ≤ 72 chars, imperative mood ("add" not "added").
  - Body explains *what* + *why*, not *how* (the diff shows how). Use bullets for multiple changes.
  - Footer: `BREAKING CHANGE:` if applicable, or `Closes #N` for a linked issue.
- **Comments** — comment the *why*, not the *what*.
  - Write a comment when the reasoning isn't obvious from the code, or a non-obvious contract/constraint/workaround exists.
  - Skip comments that just re-describe the code (`// increment counter` over `count++` is noise).
  - Single-line `//` for brief notes; JSDoc `/** */` on exported functions/hooks/components.

---

## Doc-writing principles + ADR format (from `DOC_ARCHITECT.md`)
**Eventual home: a new `docs/README.md` index.**

- **Write less, not more** — every line earns its place; if a dev can read the code in 10s, skip it.
- **Stay close to the code** — only document what exists; pull names/types/values from source; mark unknowns `<!-- TODO: verify -->`.
- **Examples over explanations** — one real code block beats a paragraph.
- **Format** — max 3 heading levels (`#`/`##`/`###`); tables for props/fields/params, prose for the rest; no filler intro paragraphs.
- **What NOT to document** — obvious utility fns, third-party lib usage (link their docs), logic already explained by code comments, anything that changes every sprint.

### ADR format (use sparingly — only when the *why* isn't obvious from the code)
File: `docs/decisions/NNN-short-title.md`
```md
# NNN — Short Title

**Status:** accepted
**Date:** YYYY-MM-DD

## Decision
One sentence: what was decided.

## Why
2–4 bullets max.

## Trade-offs
What this costs or complicates.
```
