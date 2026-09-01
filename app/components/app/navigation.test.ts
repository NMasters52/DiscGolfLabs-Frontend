import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { resolveDestination } from "./navigation.ts";

test("resolves Settings for the settings page and Clerk sub-pages", () => {
  assert.equal(resolveDestination("/app/settings")?.title, "Settings");
  assert.equal(resolveDestination("/app/settings/security")?.title, "Settings");
});

test("keeps Settings for unknown remainders but not for lookalike paths", () => {
  // Clerk's UserProfile owns every remainder; unknown ones still belong to
  // the Settings destination rather than falling back to the shell default.
  assert.equal(resolveDestination("/app/settings/bogus")?.title, "Settings");
  // Prefix must end on a path boundary — no destination claims this.
  assert.equal(resolveDestination("/app/settingsx"), undefined);
});

test("leaves the other destinations and the bare app boundary untouched", () => {
  assert.equal(resolveDestination("/app/dashboard")?.title, "Dashboard");
  assert.equal(
    resolveDestination("/app/courses/putting-course/learn/day/2")?.title,
    "Putting Course",
  );
  // The bare boundary has no single destination title; the shell falls back.
  assert.equal(resolveDestination("/app"), undefined);
});
