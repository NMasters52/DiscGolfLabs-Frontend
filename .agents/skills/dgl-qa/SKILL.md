---
name: dgl-qa
description: QA Disc Golf Labs features, maintain relevant Playwright E2E coverage, and investigate failures across free and paid user flows.
---

# DGL feature QA

Read `docs/browser-qa-protocol.md` for account restrictions, setup commands, evidence requirements, and issue-reporting rules. Paths and commands use the frontend repository root.

1. Identify the branch and changes under test. Uncommitted work is valid; preserve unrelated edits without stashing, reverting, or cleaning them.
2. Read the requirements and affected code. Define checks with a profile, steps, and observable pass conditions. A feature-QA request authorizes local execution without separate checklist approval.
3. Inspect existing `e2e/` specs. Reuse coverage that proves the required behavior; add or update tests only for missing coverage or changed requirements.
4. Complete the protocol's setup, then run focused specs for both profiles. Broaden coverage when the change warrants it. Apply the protocol's interaction and persistence checks to the affected flows.
5. Investigate failures or uncovered interactions with the account wrapper; use Playwright MCP only when deeper investigation requires it. Capture console/network diagnostics and evidence before assigning a verdict.
6. Distinguish environment problems, stale assertions, existing bugs, and feature regressions. For feature-caused bugs, reproduce, add a regression, confirm it fails, fix the bug, and confirm it passes. Keep both results; do not weaken assertions to hide failures.
7. Report requirements covered, commands/results, changes, evidence paths, expected skips, and remaining failures or blockers. Publish issue updates only under the protocol's reporting rules.
