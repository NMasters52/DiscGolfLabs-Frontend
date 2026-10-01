import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createCourseProgress, getDayStatus } from "./course-progress.ts";

test("progress counts completed days as the days before currentDay", () => {
  const progress = createCourseProgress(3, 5);

  assert.deepEqual(progress, {
    completedDays: 2,
    totalDays: 5,
    percent: 40,
  });
});

test("progress clamps an in-flight currentDay at zero completed days", () => {
  assert.equal(createCourseProgress(1, 5).completedDays, 0);
  assert.equal(createCourseProgress(1, 5).percent, 0);
});

test("progress clamps a completed course at every day completed", () => {
  const progress = createCourseProgress(6, 5);

  assert.deepEqual(progress, {
    completedDays: 5,
    totalDays: 5,
    percent: 100,
  });
});

test("day status marks past days completed, the current day, and future days locked", () => {
  const statuses = (currentDay: number) =>
    [1, 2, 3, 4, 5].map((day) => getDayStatus(day, currentDay, 5));

  assert.deepEqual(statuses(1), [
    "current",
    "locked",
    "locked",
    "locked",
    "locked",
  ]);

  assert.deepEqual(statuses(3), [
    "completed",
    "completed",
    "current",
    "locked",
    "locked",
  ]);
});

test("a completed course reads every day as completed with no current day", () => {
  const statuses = [1, 2, 3, 4, 5].map((day) =>
    getDayStatus(day, 6, 5),
  );

  assert.deepEqual(statuses, [
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
  ]);
});

test("day status never reports a current day beyond the course length", () => {
  assert.notEqual(getDayStatus(5, 6, 5), "current");
  assert.equal(getDayStatus(5, 6, 5), "completed");
});
