# Disc Golf Labs Orchestrator Playbook

## Mission

Coordinate reliable changes to Disc Golf Labs, a putting-improvement platform with interactive practice games, performance analytics, and adaptive courses. Turn each request into a small, reviewable change that fits the product and is supported by evidence.

## Project map

This workspace has two independent repositories:

- `DiscGolfLabs-Frontend/` — React Router v7, React, TypeScript, Vite, Tailwind v4, shadcn/ui, TanStack Query, Clerk. Frontend entry guidance: `AGENTS.md`; architecture and route/state references live under `docs/`.
- `DiscGolfLabs-api/` — Express, MongoDB/Mongoose, Clerk, Stripe. Start with `README.md`; API contracts, models, auth, and environment guidance live in `docs/`.

Treat frontend and API as separate Git repositories. Check status and branch in each before editing. A cross-stack task may require changes in both; verify that API payloads, authorization, persistence, and frontend state agree.

## Orchestration principles

1. **Understand before assigning.** Read the relevant repository instructions and feature docs. Trace the user-facing behavior through UI, route/data layer, API, and persistence as applicable.
2. **Keep scope concrete.** State the user outcome, in-scope behavior, constraints, likely files/systems, and acceptance criteria. Split work only where boundaries are clear and parallel changes will not collide.
3. **Give shared seams one contract owner.** One owner defines each shared contract, including request/response shapes, errors, and authorization expectations. Before parallel implementation, the orchestrator records the agreed contract in each worker's self-contained brief; workers must not depend on seeing each other's work. Assign one implementer for shared route wiring, schema changes, or integration when those edits would otherwise conflict. Parallelize independent implementation/review, not competing edits to the same files.
4. **Preserve product intent.** This is a data-driven putting training product. User-facing feedback should be clear, actionable, and consistent with the existing practice/course/analytics model. Do not invent training science or alter scoring rules without a source in the code or explicit product direction.
5. **Avoid unrequested release actions.** Do not commit, push, create a PR, deploy, or modify production data unless explicitly requested. Local, reversible implementation is authorized by the task.
6. **Protect secrets and user data.** Never print `.env`, credentials, auth state, tokens, or private account details. Use only development/test accounts and data for QA.

## Standard workflow

### 1. Intake and plan

- Restate the request as an observable user outcome.
- Identify whether it is frontend-only, API-only, or cross-stack.
- Inspect applicable `AGENTS.md`, feature spec, docs, and current implementation before deciding the design.
- Record acceptance criteria and notable unknowns. Resolve routine choices from existing patterns; ask only when a product decision materially changes behavior.
- For a larger task, make a short plan with dependencies and ownership.

### 2. Choose the workflow by task size

Match the process to the work:

- **Focused task:** One clear outcome that one agent can implement and verify in this session. The orchestrator may implement it directly without filling out the delegation template or creating a program tracker; state the completion check before editing. Delegate only when it helps, and keep any brief concise.
- **Multi-step change:** Several dependent steps or a cross-stack change. Plan the sequence, assign clear owners, and keep integration with the orchestrator.
- **Sustained program:** Work spans multiple sessions or has enough independent units that progress and dependencies need durable tracking. Use the existing Offramp project/skills workflow when it fits; otherwise use the relevant GitHub issues. Keep one source of truth for status, owners, dependencies, acceptance criteria, and verification evidence. Link related records rather than maintaining duplicate status lists. Before launching a broad wave, define the work units and dependencies, pilot one unit, and set a bounded concurrency appropriate to the review capacity.

For sustained work, each unit has one implementation owner and a clear done condition. The orchestrator reviews the evidence and diff, tracks each unit to done, replaced, or explicitly absorbed, and records blockers or scope changes in the source of truth. If a worker stalls or returns unusable work, narrow or reassign the unit, update its status, and account for the original worker before continuing. Increase ceremony only when number of units, dependencies, duration, or risk requires it.

### 3. Delegate with bounded assignments

Give each worker:

- The exact outcome and acceptance criteria.
- Repository and relevant paths/docs.
- Constraints, including no commit/push/PR/deploy unless explicitly authorized.
- Whether they may edit or should only investigate/review.
- Required handoff: files changed, decisions, evidence/commands, risks, and unresolved items.

Use the task template for delegated assignments and multi-step or sustained work. A focused task implemented directly by the orchestrator does not need a written assignment, but its completion check must still be stated before editing.

Keep integration with the orchestrator. For focused and ordinary multi-step work, the orchestrator verifies the result. In a larger sustained program, assign a verifier who did not implement the unit to review its evidence and diff; the verifier's verdict applies only to the revision reviewed, so any later changes require another verification. The orchestrator remains responsible for integrated behavior and tracking the unit to completion. Do not ask multiple workers to edit the same shared contract or files concurrently.

For repeated or large batches of similar units, pilot one unit through assignment, implementation, and verification before fanning out. Use the pilot to correct the brief, acceptance criteria, and verification method. Skip the pilot for a single focused task or when the work is not meaningfully repeatable.

### 4. Implement in the right layer

- Frontend: follow route, component, query, and game-logic conventions documented in `DiscGolfLabs-Frontend/docs/`. Keep game rules and persistence payload construction in the established game/domain layer rather than burying them in UI components.
- API: follow existing Express route/controller/model/auth patterns and document contract changes where appropriate. Validate input and enforce authorization at the server boundary.
- Cross-stack: the contract owner defines request/response shapes, errors, and authorization expectations first. The orchestrator includes that contract in every relevant brief before parallel implementation. Update both sides coherently, and consider old stored records and existing clients when changing schemas or payloads.
- Keep changes focused. Avoid opportunistic refactors unrelated to acceptance criteria.

### 5. Verify the actual behavior

Every assignment must state what evidence will prove completion before work starts. Name a command and expected result, an observable browser flow, or a concrete artifact. Choose checks appropriate to the change; do not claim a check that was not run. The orchestrator inspects the actual diff or artifact; a worker summary or green CI alone is not a verdict. If the verified code changes afterward, rerun the relevant checks on the new revision.

- Frontend build/type check: from `DiscGolfLabs-Frontend/`, `npm run typecheck` and/or `npm run build` when relevant.
- API checks: inspect package scripts and use the relevant focused checks; do not assume a test command exists.
- Browser QA: follow `DiscGolfLabs-Frontend/docs/browser-qa-protocol.md` and `DiscGolfLabs-Frontend/.agents/skills/dgl-qa/SKILL.md`. Use `DiscGolfLabs-Frontend/scripts/dgl-browser.sh` for authenticated local browser work. Keep credentials/auth state private. Browser evidence should demonstrate the user flow and resulting state, not just that a page loaded.
- For a game/scoring change, verify boundary cases and persisted session data as well as the visible score.
- For an analytics change, verify calculations against source records and empty/error states.
- For an auth/payment change, verify access boundaries and use development/test configuration only.

Report exact commands and outcomes. If verification is blocked by unavailable services or credentials, say what was blocked and what remains unverified.

### 6. Review and hand off

- Inspect the diff in every touched repository; check for accidental secrets, unrelated edits, and contract mismatches.
- Summarize behavior changed, key files, verification evidence, and known limitations.
- Clearly separate completed work from follow-up recommendations.
- Leave the workspace uncommitted unless the user asked for a commit. Do not create external side effects without authorization.

## Orchestrator task template

```text
Outcome:
User-visible behavior and why it matters.

Repositories:
Frontend / API / both, with relevant paths and docs.

Acceptance criteria:
- Observable condition 1
- Observable condition 2

Completion evidence:
- Exact command and expected result, observable browser flow, or named artifact.

Constraints:
- Preserve existing product behavior outside scope.
- No commit, push, PR, deployment, or production data changes unless separately authorized.
- Do not expose secrets or auth state.

Work plan / ownership:
- Investigation:
- Implementation:
- Integration (orchestrator):
- Verification (orchestrator for focused/ordinary multi-step work; separate reviewer for larger sustained programs):

Handoff:
Changed files, decisions, commands/evidence, risks, and unresolved items.
```

## Completion checklist

- [ ] Outcome and acceptance criteria are satisfied.
- [ ] Relevant frontend/API docs and local instructions were followed.
- [ ] Cross-stack contracts and persistence are consistent, if applicable.
- [ ] Appropriate checks were run and results are reported accurately.
- [ ] For repeated batches where a pilot can reveal process or scope problems, one unit was completed and verified before scaling out.
- [ ] Sustained-program units are accounted for as done, replaced, or absorbed, with blockers and scope changes recorded in the source of truth.
- [ ] For larger sustained programs, verification was performed by someone other than the implementer and applies to the reviewed revision.
- [ ] Diff reviewed; no secrets or unrelated changes included.
- [ ] No unrequested commit, push, PR, deployment, or external side effect occurred.
