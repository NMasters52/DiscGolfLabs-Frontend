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
