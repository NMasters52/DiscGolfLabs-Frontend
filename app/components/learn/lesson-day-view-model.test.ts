import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { buildLessonDayViewModel, getLessonDayState, learnDayHref } from "./lesson-day-view-model.ts";

function build(overrides: Partial<Parameters<typeof buildLessonDayViewModel>[0]> = {}) {
  return buildLessonDayViewModel({
    courseTitle: "Putting Course",
    dayNumber: 1,
    totalDays: 5,
    title: "Gateway Putts",
    description: "Start close and build rhythm.",
    currentDay: 1,
    courseSlug: "putting-course",
    ...overrides,
  });
}

test("heading is 'Day N: title' so the /^Day N:/ spec pin holds", () => {
  const viewModel = build();

  assert.equal(viewModel.heading, "Day 1: Gateway Putts");
  assert.match(viewModel.heading, /^Day 1:/);
});

test("eyebrow falls back to 'Course' when the course title is missing", () => {
  const viewModel = build({ courseTitle: "" });

  assert.equal(viewModel.eyebrow, "Course");
});

test("description passes through unchanged — content is spec-pinned", () => {
  const description = "Putt from the marking spot, not the tee.";
  const viewModel = build({ description });

  assert.equal(viewModel.description, description);
});

test("the current day is completable and offers no continue CTA", () => {
  const viewModel = build({ dayNumber: 2, currentDay: 2 });

  assert.equal(viewModel.dayState, "current");
  assert.equal(viewModel.canComplete, true);
  assert.equal(viewModel.continueCta, null);
});

test("a completed day cannot re-complete and continues to the next day", () => {
  const viewModel = build({ dayNumber: 1, currentDay: 2 });

  assert.equal(viewModel.dayState, "completed");
  assert.equal(viewModel.canComplete, false);
  assert.deepEqual(viewModel.continueCta, {
    label: "Continue to Day 2",
    href: "/app/courses/putting-course/learn/day/2",
  });
});

test("completing the final day finishes back at the course home", () => {
  const viewModel = build({
    dayNumber: 2,
    totalDays: 2,
    currentDay: 3,
    title: "Final Ladder",
  });

  assert.equal(viewModel.dayState, "completed");
  assert.deepEqual(viewModel.continueCta, {
    label: "Finish Course",
    href: "/app/courses/putting-course",
  });
});

test("day state helper covers the three states the sidebar renders", () => {
  assert.equal(getLessonDayState(1, 2), "completed");
  assert.equal(getLessonDayState(2, 2), "current");
  assert.equal(getLessonDayState(3, 2), "locked");
  // The canonical URL helper the sidebar links build from.
  assert.equal(learnDayHref("putting-course", 3), "/app/courses/putting-course/learn/day/3");
});
