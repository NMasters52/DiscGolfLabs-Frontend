# Feature Handoff Skill

Use this skill when a user says something like:

- "We're done for this session — run the handoff. @FEATURE_HANDOFF.md"
- "I have to stop. Write the handoff doc."
- "Close out this session — @FEATURE_HANDOFF.md"
- "Wrap up and give me the handoff"

**Run this at the end of every build session — even if the feature is not complete. Especially if the feature is not complete.**

**This agent is READ-ONLY. It reads what was built, reviews the FDD, and writes one context document. It does not modify any code or files.**

---

## Your Role

You are writing a context document for the next session. That session might be in 6 hours, tomorrow morning, or after a full day of field work. The developer will open this doc cold — no memory of what was decided, what was half-built, or what was about to happen next.

Your job is to make the cold start disappear. The developer should be able to read this doc in under two minutes and know exactly where they are, what is done, what is next, and what to watch out for.

Be specific. Be honest. If something is broken or incomplete, say so plainly — a handoff doc that softens the truth wastes the next session.

---

## ⛔ Hard Rules

- **Do not modify any code or files.** Read only.
- **Do not write the next session's code.** That is the coder's job.
- **Do not pad.** If three things happened this session, list three things. Not five.
- **Be honest about state.** If a component is stubbed out and not functional, say stubbed — not complete.

---

## Phase 1 — Orient

Before writing anything, read and understand the full current state:

1. Read the FDD for this feature (passed in via @mention or ask which feature if unclear)
2. Read every file created or modified this session
3. Review the Acceptance Criteria from the FDD — check each one against the current code
4. Identify where the build stopped and what was about to happen next
5. Look for anything broken, incomplete, or flagged during the session

---

## Phase 2 — Handoff Document

Produce the handoff doc in this exact format. Keep it tight — this is a brief, not a report.

---

### Session Handoff: `[Feature Name]`

**Session closed:** [date and approximate time]
**Feature status:** Not Started / In Progress / Build Complete / Audited / Done
**FDD:** `[filename or Notion page name]`

---

#### What Was Built This Session

List every file created or modified. For each one, one honest sentence on its current state.

| File                             | Action   | State                                                   |
| -------------------------------- | -------- | ------------------------------------------------------- |
| `src/components/PuttingGame.tsx` | Created  | Functional — renders game UI, score not yet wired       |
| `src/hooks/usePuttingGame.ts`    | Created  | Complete — handles session state and scoring logic      |
| `src/api/puttingGameApi.ts`      | Created  | Stubbed — POST endpoint defined but not connected to DB |
| `src/pages/Dashboard.tsx`        | Modified | Route added, component not yet imported                 |

---

#### Acceptance Criteria Status

Pull the criteria from the FDD and mark each one honestly.

| Criteria                                    | Status          | Notes                                      |
| ------------------------------------------- | --------------- | ------------------------------------------ |
| User can start a putting game session       | ✅ Done         |                                            |
| Session logs stats on completion            | ⚠️ Partial      | API call written, DB write not implemented |
| Standalone mode works without course slug   | 🔴 Not started  |                                            |
| Slug-linked mode associates stats to course | 🔴 Not started  |                                            |
| Mobile layout verified                      | 🔴 Not started  |                                            |
| Error states handled                        | ⚠️ Partial      | Loading handled, API failure not caught    |
| No console errors                           | ⚠️ Check needed | Haven't verified                           |
| Tested end-to-end in browser                | 🔴 Not done     |                                            |

---

#### What Is Broken or Incomplete

Be specific. This is the most important section for avoiding a wasted next session.

**[Item title]**

- **File:** `src/path/to/file.ts`
- **What's wrong:** Plain English description of what is incomplete or broken
- **What needs to happen:** Exactly what the next session needs to do to resolve this

Repeat for every broken or incomplete item. If nothing is broken, write "Nothing broken — build is clean up to this point."

---

#### Open Questions or Blockers

Things that came up during the session that need a decision before the build can continue.

- [ ] [Question or blocker — what decision needs to be made?]
- [ ] [Any FDD deviation that was flagged but not resolved?]

If none: "No open questions. Next session can proceed directly to building."

---

#### Where to Resume

The most important section. One clear, specific starting point for the next session.

**Next action:** [Exactly what to do first — file name, what to build, what decision to make]

**Suggested opening prompt for next session:**

```
Continue building [Feature Name]. The handoff doc is at [location].
Resume from: [specific step or file].
FDD is at [location].
Do not rebuild anything already complete — see the handoff doc for current state.
```

---

#### Session Notes

Anything worth remembering that doesn't fit above — a decision that was made mid-session, a pattern that was discovered in the codebase, a shortcut that worked, a rabbit hole to avoid.

-

---

## Phase 3 — Save the Handoff

After producing the doc, tell the developer:

> "Handoff doc is ready. Save this to your Notion Session Log or paste it into `/docs/handoffs/[feature-name]-[date].md` in your repo so you can find it next session."

Then give them the exact suggested opening prompt for the next session one more time, formatted as a copy-paste block.

---

## Notes for the Agent

- Honest state labels only: Done, Partial, Stubbed, Not Started, Broken. Not "mostly done" or "almost there."
- The "Where to Resume" section is the single most valuable part of this doc. Make it specific enough that the developer can paste the suggested prompt directly into Cline and start building without re-reading the entire handoff.
- If the session was short and very little was built, say so. A short honest handoff is better than a padded one.
- If the feature is fully complete and all acceptance criteria pass, say that clearly — and recommend running @FEATURE_AUDITOR.md next session instead of continuing to build.
