import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { THEME_OPTIONS, nextToggleTheme } from "./theme-options.ts";

test("exposes System, Light, and Dark in that order", () => {
  assert.deepEqual(
    THEME_OPTIONS.map(({ value, label }) => ({ value, label })),
    [
      { value: "system", label: "System" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  );
});

test("flips the header toggle from the resolved theme", () => {
  // While following a dark OS (preference "system", resolvedTheme "dark")
  // the toggle must still have somewhere to go — this is the regression the
  // preference-based check used to miss.
  assert.equal(nextToggleTheme("dark"), "light");
  assert.equal(nextToggleTheme("light"), "dark");
});

test("resolves an unknown or pending theme to dark", () => {
  assert.equal(nextToggleTheme(undefined), "dark");
});
