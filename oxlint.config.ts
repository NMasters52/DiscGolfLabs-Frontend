import { defineConfig } from "oxlint";

// Vendored anti-slop rules live in tools/oxlint/anti-slop/ (see PROVENANCE.md).
// Policy (customized 2026-11-06 after the starter-ruleset review):
//   - error: mechanical, low-false-positive checks — accumulator spread/copy
//     and unsafe type-assertion flows.
//   - warn: anti-slop/no-array-filter-map (perf policy; readability may win).
//   - off: anti-slop/no-unsafe-dictionary-type and
//     anti-slop/no-conditional-empty-object-spread — both flagged deliberate
//     unknown-input normalization contracts and the idiomatic conditional
//     options spread. Revisit only with a boundary-typing policy in place.
//   - The remaining generic anti-slop rules stay unregistered (deferred):
//     no-runtime-typeof            (needs boundary-parsing policy decisions)
//     no-shape-in-symbol-names     (high churn on existing names)
//     require-readable-spacing     (stylistic autofix — mass reformat risk)
//     require-safety-comment-for-type-assertion (needs SAFETY-comment convention)
//     no-unknown-parameters, no-unknown-returns, no-unknown-type-aliases,
//     no-object-parameters, no-module-mocking, no-reflect-apply,
//     no-reflect-get, no-known-value-widening
//   - Effect rules are intentionally not registered — this repo does not use Effect.
//
// The default "correctness" category is disabled so stock Oxlint defaults
// (unused vars, empty patterns, useless catch) stay out of this gate; explicit
// rule entries below still win over the disabled category.
//
// Fixtures and the smoke verifier live in tools/oxlint/verify/ and are ignored
// here; `npm run verify:anti-slop` lints them with a dedicated config so the
// whole-repo gate stays clean.
export default defineConfig({
  ignorePatterns: ["tools/oxlint/anti-slop/**", "tools/oxlint/verify/**"],
  categories: {
    correctness: "off",
  },
  jsPlugins: [
    { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
  ],
  rules: {
    "oxc/no-accumulating-spread": "error",
    "anti-slop/no-array-filter-map": "warn",
    "anti-slop/no-reduce-accumulator-copy": "error",
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "off",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/no-unsafe-dictionary-type": "off",
  },
});
