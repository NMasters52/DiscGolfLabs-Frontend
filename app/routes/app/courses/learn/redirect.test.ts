import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { getLearnIndexDestination } from "./redirect.ts";

test("sends an in-progress enrollment to its current course day", () => {
  const destination = getLearnIndexDestination({
    courseSlug: "putting-course",
    currentDay: 3,
    totalDays: 5,
  });

  assert.equal(destination, "/app/courses/putting-course/learn/day/3");
});

test("clamps a current day below one to day one", () => {
  const destination = getLearnIndexDestination({
    courseSlug: "putting-course",
    currentDay: 0,
    totalDays: 5,
  });

  assert.equal(destination, "/app/courses/putting-course/learn/day/1");
});

test("sends a completed enrollment to the dashboard", () => {
  const destination = getLearnIndexDestination({
    courseSlug: "putting-course",
    currentDay: 6,
    totalDays: 5,
  });

  assert.equal(destination, "/app/dashboard");
});
