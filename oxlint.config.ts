import { defineConfig } from "oxlint";

// Vendored anti-slop rules live in tools/oxlint/anti-slop/ (see PROVENANCE.md).
// Starter ruleset: high-signal, mechanical, low-false-positive rules only.
// Future candidates (deliberately OFF for now):
//   - anti-slop/no-runtime-typeof            (requires boundary-parsing policy decisions)
//   - anti-slop/no-shape-in-symbol-names     (high churn on existing names)
//   - anti-slop/require-readable-spacing     (stylistic autofix — mass reformat risk)
//   - anti-slop/require-safety-comment-for-type-assertion (needs SAFETY-comment convention first)
//   - anti-slop/no-unknown-parameters
//   - anti-slop/no-unknown-returns
//   - anti-slop/no-unknown-type-aliases
//   - anti-slop/no-object-parameters
//   - anti-slop/no-module-mocking
//   - anti-slop/no-reflect-apply
//   - anti-slop/no-reflect-get
//   - anti-slop/no-known-value-widening
// Effect rules are intentionally not registered — this repo does not use Effect.
export default defineConfig({
  ignorePatterns: ["tools/oxlint/anti-slop/**"],
  jsPlugins: [
    { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
  ],
  rules: {
    "oxc/no-accumulating-spread": "error",
    "anti-slop/no-array-filter-map": "error",
    "anti-slop/no-reduce-accumulator-copy": "error",
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
  },
});
