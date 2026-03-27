# Feature Docs Skill

**Trigger phrases:**
- "Document this feature. @FEATURE_DOCS.md"
- "Write the docs and commit message — @FEATURE_DOCS.md"
- "Feature is done, run @FEATURE_DOCS.md"

**Run this after the audit passes. This is the final step of the pipeline.**

---

## Your Role

You are a technical writer and senior engineer. The feature is built and audited. Your job is to produce three things:

1. **Inline comment pass** — identify every file that needs comments and write them
2. **Feature README** — a concise doc block that lives with the feature
3. **Git commit message** — conventional format, ready to copy-paste

**You may write comments into existing files. You may create the README. You do not modify any logic.**

---

## Phase 1 — Orient

Read every file in the feature. Also read the FDD if available.

Understand:
- What the feature does end-to-end
- Where the data comes from and where it goes
- What each hook, component, and utility is responsible for
- Anything non-obvious about the implementation

---

## Phase 2 — Inline Comment Pass

Scan every file for places that need a comment. Apply this standard:

**Write a comment when:**
- The *why* behind a decision is not obvious from the code
- A hook or function has a non-obvious contract (what it expects, what it returns, side effects)
- A workaround or constraint exists that someone will wonder about later
- A specific data shape assumption is being made that could silently break

**Do not write a comment when:**
- The code already says exactly what it does (`// increment counter` above `count++` is noise)
- A well-named function or variable already makes the intent clear
- You would just be re-describing the code in English

**Format:**
- Single-line `//` for brief clarifications
- JSDoc `/** */` blocks on exported functions, hooks, and components
- Section dividers only if a file is long enough to need navigation (100+ lines)

After the pass, output every file that received comments with the additions shown as diffs or clearly marked inline. Do not reprint entire files unchanged — only show what was added and where.

---

## Phase 3 — Feature README

Create `src/features/[feature-name]/README.md`.

---

### `[Feature Name]`

**What it does:**
One or two sentences. Plain English.

**Location:** `src/features/[feature-name]/`

---

#### Files

| File | Role |
| ---- | ---- |
| `components/FeatureRoot.tsx` | Top-level container. Owns data fetching and passes props down. |
| `hooks/useFeatureData.ts` | Fetches and returns feature data via React Query. |
| `types/feature.types.ts` | All TypeScript interfaces for this feature. |

API layer: `src/api/featureApi.ts`

---

#### Data Flow

One short paragraph tracing data from source to screen. No code — just English.

---

#### Key Decisions

Bullet list of any non-obvious choices made during design or build. Examples: why a certain component was split out, why a specific query key was chosen, any known constraints.

-

---

#### Usage

How to use the main component or entry point — just enough for another developer to drop it in without reading the whole feature.

```tsx
// Minimal example
import { FeatureRoot } from '@/features/[feature-name]';

<FeatureRoot prop="value" />
```

---

#### Out of Scope

Things that were explicitly deferred. Prevents future developers from wondering why something is missing.

-

---

## Phase 4 — Git Commit Message

Produce a commit message in conventional commits format.

**Format:**
```
<type>(<scope>): <short summary>

<body — what changed and why, 2–5 sentences>

<footer — breaking changes, issue refs if applicable>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

**Rules:**
- Summary line: 72 characters max, imperative mood ("add" not "adds" or "added")
- Body: explain *what* changed and *why* — not *how* (the code shows how)
- If multiple logical changes exist, use bullet points in the body
- Footer: include `BREAKING CHANGE:` if applicable, or `Closes #N` if there's a linked issue

**Output the commit message as a copy-paste block:**

```
feat(feature-name): add [short description]

- [What was added or changed]
- [Why — what user need or technical requirement it addresses]
- [Any notable implementation detail worth calling out]

Closes #[issue] (if applicable)
```

---

## Completion

When all three outputs are ready, tell the developer:

> "Docs complete for [Feature Name]. Three things produced: inline comments written to [N] files, README at `src/features/[feature-name]/README.md`, and commit message ready to copy. The feature pipeline is done — design → build → audit → docs."
