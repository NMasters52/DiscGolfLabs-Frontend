import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createCourseHomeViewModel } from "./course-home-view-model.ts";

const course = {
  _id: "course-1",
  slug: "putting-course",
  title: "Putting",
  description: "A five-day putting curriculum.",
  totalDays: 5,
  days: [
    { dayNumber: 1, title: "Stance & Grip", description: "d1" },
    { dayNumber: 2, title: "Aiming & Alignment", description: "d2" },
    { dayNumber: 3, title: "Routine & Rhythm", description: "d3" },
    { dayNumber: 4, title: "Distance Control", description: "d4" },
    { dayNumber: 5, title: "Pressure Putting", description: "d5" },
  ],
};

const enrolledAt = (currentDay: number) => ({
  enrolled: true,
  currentDay,
  totalDays: 5,
});

test("is loading while the course resolves, then while its enrollment resolves", () => {
  assert.equal(
    createCourseHomeViewModel({ courseLoading: true }).state,
    "loading",
  );
  assert.equal(
    createCourseHomeViewModel({
      course,
      enrollmentLoading: true,
    }).state,
    "loading",
  );
});

test("is loadError when the course or its enrollment fails", () => {
  const failedCourse = createCourseHomeViewModel({
    courseError: new Error("course not found"),
  });

  assert.equal(failedCourse.state, "loadError");
  assert.equal(failedCourse.days.length, 0);

  const failedEnrollment = createCourseHomeViewModel({
    course,
    enrollmentError: new Error("Enrollment check failed"),
  });

  assert.equal(failedEnrollment.state, "loadError");
});

test("a signed-in non-enrollee sees locked days and the enroll path", () => {
  const viewModel = createCourseHomeViewModel({
    course,
    enrollment: { enrolled: false },
  });

  assert.equal(viewModel.state, "notEnrolled");
  assert.equal(viewModel.days.length, 5);
  assert.ok(viewModel.days.every((day) => day.status === "locked"));
  assert.ok(viewModel.days.every((day) => day.to === null));
  assert.deepEqual(viewModel.primaryCta, {
    label: "View course & enroll",
    to: "/courses/putting-course",
  });
});

test("day one reads current with a start CTA", () => {
  const viewModel = createCourseHomeViewModel({
    course,
    enrollment: enrolledAt(1),
  });

  assert.equal(viewModel.state, "inProgress");
  assert.deepEqual(viewModel.primaryCta, {
    label: "Start Day 1",
    to: "/app/courses/putting-course/learn/day/1",
  });

  const statuses = viewModel.days.map((day) => day.status);
  assert.deepEqual(statuses, [
    "current",
    "locked",
    "locked",
    "locked",
    "locked",
  ]);
  assert.equal(viewModel.days[1].to, null);
});

test("mid-course, completed days open for review and the current day continues", () => {
  const viewModel = createCourseHomeViewModel({
    course,
    enrollment: enrolledAt(3),
  });

  assert.equal(viewModel.state, "inProgress");
  assert.deepEqual(viewModel.primaryCta, {
    label: "Continue Day 3",
    to: "/app/courses/putting-course/learn/day/3",
  });
  assert.deepEqual(
    viewModel.days.map((day) => day.status),
    ["completed", "completed", "current", "locked", "locked"],
  );
  assert.equal(viewModel.progress?.completedDays, 2);
  assert.equal(viewModel.days[0].to, "/app/courses/putting-course/learn/day/1");
});

test("a completed enrollment unlocks every day for review", () => {
  const viewModel = createCourseHomeViewModel({
    course,
    enrollment: enrolledAt(6),
  });

  assert.equal(viewModel.state, "completed");
  assert.deepEqual(
    viewModel.days.map((day) => day.status),
    ["completed", "completed", "completed", "completed", "completed"],
  );
  assert.ok(
    viewModel.days.every(
      (day) => day.to !== null && day.to.includes("/learn/day/"),
    ),
  );
  assert.deepEqual(viewModel.primaryCta, {
    label: "Review Day 1",
    to: "/app/courses/putting-course/learn/day/1",
  });
  assert.equal(viewModel.progress?.percent, 100);
  assert.equal(viewModel.headline, "Course Complete");
});

test("day rows carry their titles from the course data", () => {
  const viewModel = createCourseHomeViewModel({
    course,
    enrollment: enrolledAt(1),
  });

  assert.equal(viewModel.days[0].title, "Stance & Grip");
  assert.equal(viewModel.days[4].title, "Pressure Putting");
});

test("days fall back to derived rows when the course omits them", () => {
  const viewModel = createCourseHomeViewModel({
    course: { ...course, days: undefined },
    enrollment: enrolledAt(1),
  });

  assert.equal(viewModel.days.length, 5);
  assert.equal(viewModel.days[0].title, "Day 1");
});
