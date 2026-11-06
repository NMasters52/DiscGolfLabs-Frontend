#!/usr/bin/env node
// Smoke verification for the vendored anti-slop rules (tools/oxlint/anti-slop/).
//
// One command, two directions:
//   1. fixtures/bad/ must trigger each gated rule at its gate severity, one
//      fixture per rule. Proves the plugin still loads and detects.
//   2. fixtures/clean/ must produce zero diagnostics. Proves the accepted
//      patterns (parser-boundary dictionaries, mutating reducers, `as const`
//      chains, conditional options spreads) stay allowed.
//
// The repo-wide gate (oxlint.config.ts) ignores this directory so the fixtures
// never pollute `npm run lint:anti-slop`. That same ignore would also stop
// explicit-path linting, so this command lints the fixtures through a
// dedicated config, verify.config.json, which registers the same plugin and
// the same rule severities without the ignore entry. Run via:
//   npm run verify:anti-slop

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const oxlintBin = join(repoRoot, "node_modules", "oxlint", "bin", "oxlint");
const config = join(here, "verify.config.json");
const badDir = join(here, "fixtures", "bad");
const cleanDir = join(here, "fixtures", "clean");

// One expectation per bad fixture: the rule that must fire, at the severity
// the gate enforces. Rule names use the `plugin/rule` spelling; oxlint JSON
// output spells them `plugin(rule)`.
const expectations = [
  { fixture: "accumulating-spread.ts", rule: "oxc/no-accumulating-spread", severity: "error" },
  { fixture: "reduce-accumulator-copy.ts", rule: "anti-slop/no-reduce-accumulator-copy", severity: "error" },
  { fixture: "chained-type-assertions.ts", rule: "anti-slop/no-chained-type-assertions", severity: "error" },
  { fixture: "widen-then-assert.ts", rule: "anti-slop/no-widen-then-assert", severity: "error" },
  { fixture: "array-filter-map.ts", rule: "anti-slop/no-array-filter-map", severity: "warning" },
];

const cleanFixtures = [
  "as-const-chain.ts",
  "conditional-options-spread.ts",
  "parser-boundary.ts",
  "reducer-mutation.ts",
];

function lint(target) {
  const started = Date.now();
  const result = spawnSync(process.execPath, [oxlintBin, "-c", config, "-f", "json", target], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const durationMs = Date.now() - started;
  let json = null;
  try {
    json = JSON.parse(result.stdout);
  } catch {
    // Leave null; the checks below report the raw output.
  }
  return { exitCode: result.status, json, durationMs, stdout: result.stdout, stderr: result.stderr };
}

function gateRuleName(diagnosticCode) {
  const match = /^([a-z0-9-]+)\((.+)\)$/.exec(diagnosticCode ?? "");
  return match ? `${match[1]}/${match[2]}` : (diagnosticCode ?? "<no rule>");
}

const failures = [];
function check(ok, message) {
  if (!ok) failures.push(message);
  return ok;
}

// --- Bad fixtures: every expected rule must fire in its own fixture. ---
const bad = lint(badDir);
console.log(`Bad fixtures (${badDir}):`);
check(bad.json !== null, `bad run produced unparseable output:\n${bad.stdout}${bad.stderr}`);
check(bad.exitCode === 1, `bad run exited ${bad.exitCode}, expected 1 (gated errors must fail the run)`);
if (bad.json !== null) {
  const diagnostics = bad.json.diagnostics ?? [];
  check(
    bad.json.number_of_files === expectations.length,
    `bad run linted ${bad.json.number_of_files} files, expected ${expectations.length}`,
  );
  const expectedRules = new Set(expectations.map((item) => item.rule));
  for (const diagnostic of diagnostics) {
    const rule = gateRuleName(diagnostic.code);
    check(
      expectedRules.has(rule),
      `unexpected diagnostic in bad fixtures: ${rule} in ${diagnostic.filename}`,
    );
  }
  for (const { fixture, rule, severity } of expectations) {
    const hit = diagnostics.find(
      (item) =>
        gateRuleName(item.code) === rule &&
        item.severity === severity &&
        item.filename.endsWith(fixture),
    );
    check(Boolean(hit), `expected ${severity} from ${rule} in fixtures/bad/${fixture}, none found`);
    const marker = hit ? "PASS" : "FAIL";
    console.log(`  ${marker}  ${severity.padEnd(7)} ${rule} (fixtures/bad/${fixture})`);
  }
}

// --- Clean fixtures: zero diagnostics of any kind. ---
const clean = lint(cleanDir);
console.log(`Clean fixtures (${cleanDir}):`);
check(clean.json !== null, `clean run produced unparseable output:\n${clean.stdout}${clean.stderr}`);
check(clean.exitCode === 0, `clean run exited ${clean.exitCode}, expected 0`);
if (clean.json !== null) {
  const diagnostics = clean.json.diagnostics ?? [];
  check(
    clean.json.number_of_files === cleanFixtures.length,
    `clean run linted ${clean.json.number_of_files} files, expected ${cleanFixtures.length}`,
  );
  for (const diagnostic of diagnostics) {
    check(false, `clean fixture flagged: ${gateRuleName(diagnostic.code)} in ${diagnostic.filename}`);
  }
  console.log(
    `  ${diagnostics.length === 0 ? "PASS" : "FAIL"}  ${diagnostics.length} diagnostics across ${clean.json.number_of_files} files`,
  );
}

console.log(
  `Timings: bad ${bad.durationMs}ms, clean ${clean.durationMs}ms (exit codes: bad ${bad.exitCode}, clean ${clean.exitCode})`,
);

if (failures.length > 0) {
  console.error(`\nverify:anti-slop FAILED (${failures.length} problem${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("\nverify:anti-slop passed: gated rules detect, accepted patterns stay clean.");
