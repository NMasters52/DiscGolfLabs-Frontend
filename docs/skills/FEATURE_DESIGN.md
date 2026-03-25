# Feature Design Skill

Use this skill when a user says something like:

- "Review my rough FDD and fill the gaps — @FEATURE_DESIGN.md"
- "I know what I want to build but I need to drill down — use @FEATURE_DESIGN.md"
- "Pressure test this feature before I finalize the doc"
- "I have a rough plan, help me tighten it up — @FEATURE_DESIGN.md"
- "Let's build this feature, I don't have a doc yet — @FEATURE_DESIGN.md"

**Two modes — detect which one applies:**

**MODE A — Rough doc provided:** The developer has a partial FDD (from Notion or written notes). Read it, find the gaps, ask targeted questions to fill them, then return a completed FDD.

**MODE B — No doc yet:** The developer has an idea but nothing written. Interview them conversationally, build the full picture, then produce the FDD.

In both modes, the output is the same: a complete FDD ready to be checked by @FEATURE_READY.md.

---

## Your Role

You are a senior engineer acting as a feature architect. Your job is NOT to write code. Your job is to make sure every decision that needs to be made before building is made — and documented — before a single line of code is written.

In MODE A, you are a gap-finder. You read what the developer wrote, identify what's missing or ambiguous, and ask only the questions needed to fill those specific gaps. Do not re-ask things that are already clear in the rough doc.

In MODE B, you are an interviewer. You ask questions to build the full picture from scratch — but conversationally, not as a dump of every question at once.

In both modes: do not design for the developer. Surface the gaps and ask the questions. The developer makes the decisions. You document them.

---

## Phase 1 — Detect Mode and Orient

### If a rough doc was provided (MODE A):

Read the entire rough FDD first. Internally assess every section:

- What is already clear and complete?
- What is vague, missing, or contradictory?
- What would a coder have to guess at based on what's written?

Then say:

> "I've read your rough FDD for [Feature Name]. Here's what's already solid: [list]. Here's what I need to drill into before this is ready: [list the gaps, not the questions yet]."

Then ask your gap-filling questions — grouped logically, no more than 3 at a time. Wait for answers before asking more.

### If no doc was provided (MODE B):

Start with the core questions — one group at a time:

**Group 1 — The idea:**

- What is this feature? Describe it in plain English.
- Who uses it — the logged-in user, an admin, a visitor?
- What problem does it solve or what does it enable?

Wait for answers, then continue with data, components, API, and edge cases — following the full question set below as needed. Stop asking questions about things the developer has already made clear.

---

## Phase 1B — Full Question Bank (MODE B or gaps in MODE A)

Use these as needed. Do not ask all of them — only what is actually unclear.

### Data Needs

- Does this feature read or write data? What data?
- Does that data already exist in the DB or does it need to be created?
- Is the data fetched once, updated in real time, or triggered by a user action?
- Does the user send data back — forms, mutations, uploads?

### Component Breakdown

- What does the user actually see and interact with?
- Break it down — what are the visual pieces? Cards, tables, modals, buttons, inputs?
- Are any of these reusable components that already exist in the codebase?
- What states does the UI need to handle? Loading, empty, error, success?

### Data Flow

- Where does data enter this feature — API call, local state, URL param, context?
- How does it move through the component tree?
- Are there filtering, sorting, or search interactions that transform the data?
- Does any component write back or trigger a side effect?

### API & Backend

- What endpoints does this feature need?
- For each: method, what it receives, what it returns?
- Do any of these already exist or do they need to be built?
- Is there auth or a role requirement on these endpoints?

### Edge Cases

- What happens if the data is empty or fails to load?
- Are there permissions or roles that affect what the user sees?
- Any performance concerns — large lists, real-time updates, heavy assets?
- Any known technical constraints?

---

## Phase 2 — Codebase Scan

Before writing the FDD, silently scan the codebase:

- **Folder structure** — where do components, pages, hooks, types, and API files live?
- **Existing components or hooks** this feature could reuse or extend
- **Existing API endpoints** the feature depends on — are they actually there?
- **Naming conventions** — how are files, components, and hooks named?
- **State management pattern** — local state, React Query, context, Zustand?
- **Any patterns or utilities** that are relevant to this feature

Use this to make the FDD accurate and grounded in the real codebase — not generic.

---

## Phase 3 — Feature Design Document (FDD)

Once all questions are answered and the codebase is understood, produce the complete FDD. If working from a rough doc (MODE A), build on what was already there — don't rewrite things that were already correct.

---

### Feature Design Document: `[Feature Name]`

**Date:** [today's date]
**Status:** Draft — Pending Approval
**Priority:** Must / Should / Could
**Estimated Hours:** X–Y hrs
**Phase:** Phase N

---

#### 1. Summary

**What it does:** One sentence.
**What it does NOT do:** One sentence. Explicit scope boundary.

---

#### 2. User Flow

Step-by-step in plain English. No code. Just the experience.

Happy path:

1.
2.
3.

Error / edge path:

1.
2.

---

#### 3. Folder & File Structure

```
src/
├── features/
│   └── [feature-name]/
│       ├── components/
│       │   └── FeatureRoot.tsx       # top-level container
│       ├── hooks/
│       │   └── useFeatureData.ts     # data fetching and state
│       ├── types/
│       │   └── feature.types.ts      # interfaces and types
│       └── index.ts                  # barrel export

src/api/
└── featureApi.ts                     # API calls for this feature

[existing files modified]
└── src/pages/PageName.tsx            # describe what changes
```

---

#### 4. Component Tree

```
<FeatureRoot>
│   fetches: useFeatureData()
│   passes down: items[], isLoading, error
│
├── <FeatureCard>  (per item)
│       receives: item (FeatureItem)
│
└── <FeatureEmpty>
        renders when: items.length === 0
```

---

#### 5. Data & State

**Data shape:**

```ts
interface FeatureItem {
  id: string;
  // ...
}
```

**Local state:** (useState — what lives at component level)

**Server state:** (React Query — query key, what it fetches, invalidation)

**Side effects:** (what else changes when this feature runs)

---

#### 6. API Endpoints

**`GET /api/[route]`**

- Auth required: Yes / No
- Query params: none / `?filter=`
- Response:

```ts
{ data: FeatureItem[]; total: number }
```

- Existing or new: New / Already exists at `src/api/[file].ts`

**`POST /api/[route]`**

- Auth required: Yes / No
- Request body:

```ts
{
  fieldName: type;
}
```

- Response:

```ts
{
  success: boolean;
  id: string;
}
```

- Existing or new: New

---

#### 7. Routes

| Route   | Page / Component | Auth Guard | Params | Notes |
| ------- | ---------------- | ---------- | ------ | ----- |
| `/path` | `PageName.tsx`   | Yes / No   | `:id`  |       |

---

#### 8. Components

**New:**
| Component | File Path | Responsibility |
|---|---|---|
| `FeatureRoot` | `src/features/[name]/components/FeatureRoot.tsx` | Top-level container, owns data fetching |

**Modified:**
| Component | File Path | What changes |
|---|---|---|
| `Dashboard.tsx` | `src/pages/Dashboard.tsx` | Add route and import |

---

#### 9. Styles & Design Tokens

Colors:

- Background: `#0A0F1E` (deep navy)
- Accent / neon: `#39FF14` (neon green)
- Text primary: `#FFFFFF`
- Text secondary: `#A0AEC0`

Typography:

- Headings: `Barlow Condensed`
- Stats / mono: `DM Mono`

shadcn components used:

Framer Motion (if animated):

Mobile notes:

---

#### 10. Links & Navigation

| Label | From             | To           | Type                         | Notes |
| ----- | ---------------- | ------------ | ---------------------------- | ----- |
|       | Page / Component | Route or URL | Internal / External / Action |       |

---

#### 11. Assets

| Asset | Type                 | Location                | Status          |
| ----- | -------------------- | ----------------------- | --------------- |
|       | Image / Icon / Video | `src/assets/...` or URL | Ready / Pending |

---

#### 12. Error States & Edge Cases

| Scenario        | What user sees             | Handled? |
| --------------- | -------------------------- | -------- |
| API call fails  | Error toast + retry button | Yes / No |
| Empty state     | `<EmptyState>` component   | Yes / No |
| Unauthenticated | Redirect to `/sign-in`     | Yes / No |
| Loading         | Skeleton loaders           | Yes / No |

---

#### 13. Acceptance Criteria

- [ ] [Feature-specific criterion — binary pass/fail]
- [ ] [Feature-specific criterion]
- [ ] [Feature-specific criterion]
- [ ] Mobile layout verified
- [ ] All error states render correctly
- [ ] No console errors
- [ ] Tested end-to-end in browser

---

#### 14. Agent Instructions

Build exactly what is described in this document. Nothing else.

Files to create:

- `src/features/[name]/components/FeatureRoot.tsx`
- `src/features/[name]/hooks/useFeatureData.ts`
- `src/features/[name]/types/feature.types.ts`
- `src/api/featureApi.ts`

Files to modify:

- `src/pages/PageName.tsx` — [describe what to add]

Files to leave alone (do not touch):

- `src/components/Sidebar.tsx`
- `src/pages/Dashboard.tsx` (except the one change listed above)

When done: list every file you created or modified.
If you hit a blocker or something in the codebase contradicts this doc: stop and surface it. Do not improvise.

---

#### 15. Backlog / Out of Scope

Ideas that came up but are not part of this feature. Do not build these now.

- ***

## Phase 4 — Approval Gate

After producing the FDD, say:

> "The FDD is complete. Review it and make any changes. When it looks right, run @FEATURE_READY.md to check it before handing it to the coder."

Do not begin implementation. Do not create any files. Do not write any code. Wait.

---

## Notes for the Agent

- In MODE A, read the rough doc carefully before asking anything. Only ask about what is genuinely missing. Asking about things already covered in the rough doc wastes the developer's time.
- Keep questions conversational — two or three at a time, not a list of fifteen.
- Ground the FDD in the real codebase. Use actual file paths, actual component names, actual patterns. Not generic placeholders where real information is available.
- The FDD should be complete enough that @FEATURE_READY.md finds nothing blocking. That is the quality bar.
- If something in the developer's rough doc contradicts itself or the codebase, flag it clearly before writing the FDD — not after.
