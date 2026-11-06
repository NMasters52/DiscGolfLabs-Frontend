# Provenance

- **Upstream repository:** https://github.com/dmmulroy/anti-slop
- **Upstream commit:** `13909c9e07590f5a85d93c62712259fe14a883f7` (merge of PR #45, "feat/group-singleline-bindings")
- **Upstream commit date:** 2026-10-13 20:18:33 -0400
- **Upstream version field:** `oxlint-plugin-anti-slop` 0.1.2 (private package, no npm release)
- **License:** MIT (see `LICENSE`)
- **Vendored on:** 2026-11-06

## What was copied

The upstream `src/` directory was copied verbatim into this directory (`index.ts`, `rules/`, `effect/`, `shared/`, `vendor/`), including the upstream RuleTester `*.test.ts` files and the vendored `eslint-stylistic` helpers (`vendor/` with its own `LICENSE` and `UPSTREAM.md`).

## Vendored rule inventory

Generic rules (`rules/`):

- `no-array-filter-map`
- `no-reduce-accumulator-copy`
- `no-chained-type-assertions`
- `no-conditional-empty-object-spread`
- `no-known-value-widening`
- `no-module-mocking`
- `no-object-parameters`
- `no-reflect-apply`
- `no-reflect-get`
- `no-runtime-typeof`
- `no-shape-in-symbol-names`
- `no-unknown-parameters`
- `no-unknown-returns`
- `no-unknown-type-aliases`
- `no-unsafe-dictionary-type`
- `no-widen-then-assert`
- `require-readable-spacing`
- `require-safety-comment-for-type-assertion`

Effect rules (`effect/`, not registered in this repo — the app does not use Effect):

- `no-manual-effect-error-tag`
- `no-manual-tag-comparison`
- `no-manual-tagged-construction`
- `no-service-constructor-imports`
- `prefer-effect-match`

## Matching dependency versions

Upstream pins (exact, in its `package.json`): `oxlint` 1.78.0 and `@oxlint/plugins` 1.78.0.
This repo installs the same exact versions as devDependencies; upgrade both together.

## Maintenance policy

This directory is vendored and locally owned. Do not edit these files ad hoc; to update, re-copy from a named upstream revision and record the new commit here, preserving any local customizations explicitly.

## Upgrade ritual

Everything below lives outside this directory: severities, ignore patterns, and
deferred rules are configured in `oxlint.config.ts`; fixtures and the smoke
verifier live in `tools/oxlint/verify/` (run with `npm run verify:anti-slop`).
When adopting a new upstream revision:

1. **Bump the pins together.** Set `oxlint` and `@oxlint/plugins` in
   `package.json` to the same exact version the upstream revision targets (see
   its `package.json`). These two move as a pair; mismatched versions are not
   supported. Run `npm install` and commit the updated `package-lock.json`.
2. **Merge upstream `src/` as a normal git merge.** The vendored tree is a
   verbatim copy of upstream `src/` (`index.ts`, `rules/`, `effect/`,
   `shared/`, `vendor/`). Local customization lives in `oxlint.config.ts` and
   `tools/oxlint/verify/` — never in rule source. Merge the new upstream
   commit into this directory and resolve conflicts in favor of upstream.
3. **Run the smoke test.** `npm run verify:anti-slop` must pass both ways: the
   bad fixtures (`tools/oxlint/verify/fixtures/bad/`, one per rule) must still
   trigger `oxc/no-accumulating-spread`, `anti-slop/no-reduce-accumulator-copy`,
   `anti-slop/no-chained-type-assertions`, and `anti-slop/no-widen-then-assert`
   as errors plus `anti-slop/no-array-filter-map` as a warning, and the clean
   fixtures (`tools/oxlint/verify/fixtures/clean/`) must produce zero
   diagnostics. A failure means the upgrade changed detection or the plugin
   API; do not ship it silently.
4. **Run the local gate.** `npm run lint:anti-slop` (exit 0, no diagnostics),
   `npm run typecheck` (exit 0), and `npm run test:unit` (all pass).
5. **Record the revision.** Update the upstream commit, commit date, and
   "Vendored on" date at the top of this file before committing.

