import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { COURSE_ROUTE, resolveDestination, resolveMobileTab } from "./navigation.ts";

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

test("maps each bottom-bar destination to its tab", () => {
  assert.equal(resolveMobileTab("/app/dashboard"), "dashboard");
  assert.equal(resolveMobileTab("/app/courses/putting-course/learn"), "course");
  assert.equal(
    resolveMobileTab("/app/courses/putting-course/learn/day/2"),
    "course",
  );
});

test("maps Settings and its Clerk sub-pages to More", () => {
  // The More sheet is Settings' mobile surface, so the tab stays active
  // wherever the combined Account and Settings page is current.
  assert.equal(resolveMobileTab("/app/settings"), "more");
  assert.equal(resolveMobileTab("/app/settings/security"), "more");
});

test("leaves unowned paths unclaimed for the bottom bar too", () => {
  assert.equal(resolveMobileTab("/app"), undefined);
  assert.equal(resolveMobileTab("/app/settingsx"), undefined);
});

test("Course tab route stays inside the course destination", () => {
  // Guards against the canonical route drifting away from the destination
  // prefix the active-state lookup uses.
  assert.equal(resolveDestination(COURSE_ROUTE)?.title, "Putting Course");
});
