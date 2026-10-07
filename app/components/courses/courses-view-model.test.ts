import assert from "node:assert/strict";
import test from "node:test";
import {
  createCourseCardViewModel,
  createCoursesViewModel,
  resolveCardAction,
  // @ts-expect-error Node's native type stripping requires the explicit extension.
} from "./courses-view-model.ts";

const course = {
  _id: "course-1",
  slug: "putting-course",
  title: "Putting",
  description: "A five-day putting curriculum.",
  priceInCents: 6000,
  totalDays: 5,
};

const enrollmentReady = {
  isPending: false,
  error: null,
};

test("page is loading while the course list is pending", () => {
  const viewModel = createCoursesViewModel({ coursesLoading: true });

  assert.equal(viewModel.state, "loading");
  assert.deepEqual(viewModel.cards, []);
});

test("page is loadError when the course list fails and keeps the error", () => {
  const error = new Error("network unavailable");
  const viewModel = createCoursesViewModel({ coursesError: error });

  assert.equal(viewModel.state, "loadError");
  assert.equal(viewModel.error, error);
});

test("failed background refresh keeps cached cards and their open sheet usable", () => {
  const error = new Error("background refresh failed");
  const viewModel = createCoursesViewModel({
    courses: [course],
    coursesError: error,
    enrollmentByCourseId: new Map([
      ["course-1", { ...enrollmentReady, data: { enrolled: false } }],
    ]),
  });

  assert.equal(viewModel.state, "ready");
  assert.equal(viewModel.cards.length, 1);
  assert.equal(viewModel.cards[0].courseId, course._id);
  assert.equal(viewModel.cards[0].status, "notEnrolled");
  assert.equal(resolveCardAction(viewModel.cards[0]).type, "openSheet");
  // An open sheet stays usable: its course still has a visible card.
  assert(viewModel.cards.some((card) => card.courseId === course._id));
});

test("page is empty when no courses exist yet", () => {
  const viewModel = createCoursesViewModel({ courses: [] });

  assert.equal(viewModel.state, "empty");
});

test("page is ready with one card per course, paired with its enrollment result", () => {
  const viewModel = createCoursesViewModel({
    courses: [course],
    enrollmentByCourseId: new Map([
      [
        "course-1",
        {
          ...enrollmentReady,
          data: { enrolled: true, currentDay: 3, totalDays: 5 },
        },
      ],
    ]),
  });

  assert.equal(viewModel.state, "ready");
  assert.equal(viewModel.cards.length, 1);
  assert.equal(viewModel.cards[0].status, "inProgress");
  assert.equal(viewModel.cards[0].currentDay, 3);
  assert.equal(viewModel.cards[0].progress?.completedDays, 2);
});

test("enrollment checks pair by course ID, not list position", () => {
  const courseA = { ...course, _id: "course-a" };
  const courseB = { ...course, _id: "course-b", slug: "chipping-course" };
  const viewModel = createCoursesViewModel({
    courses: [courseA, courseB],
    enrollmentByCourseId: new Map([
      [
        "course-b",
        {
          ...enrollmentReady,
          data: { enrolled: true, currentDay: 2, totalDays: 5 },
        },
      ],
    ]),
  });

  assert.equal(viewModel.cards[0].courseId, "course-a");
  assert.equal(viewModel.cards[0].status, "loading");
  assert.equal(viewModel.cards[1].courseId, "course-b");
  assert.equal(viewModel.cards[1].status, "inProgress");
});

test("a course with a missing ID stays loading and does not shift other cards", () => {
  const idLess = { ...course, _id: undefined, slug: "mystery-course" };
  const viewModel = createCoursesViewModel({
    courses: [idLess, course],
    enrollmentByCourseId: new Map([
      [
        "course-1",
        {
          ...enrollmentReady,
          data: { enrolled: true, currentDay: 4, totalDays: 5 },
        },
      ],
    ]),
  });

  assert.equal(viewModel.cards[0].courseId, "");
  assert.equal(viewModel.cards[0].status, "loading");
  assert.equal(viewModel.cards[1].courseId, "course-1");
  assert.equal(viewModel.cards[1].status, "inProgress");
  assert.equal(viewModel.cards[1].currentDay, 4);
});

test("a card whose enrollment result has not arrived stays loading", () => {
  const viewModel = createCoursesViewModel({
    courses: [course],
    enrollmentByCourseId: new Map(),
  });

  assert.equal(viewModel.cards[0].status, "loading");
  assert.equal(viewModel.cards[0].progress, null);
});

test("a card with a failed enrollment check reports its own error", () => {
  const error = new Error("Enrollment check failed");
  const viewModel = createCoursesViewModel({
    courses: [course],
    enrollmentByCourseId: new Map([["course-1", { ...enrollmentReady, error }]]),
  });

  assert.equal(viewModel.cards[0].status, "error");
  assert.equal(viewModel.cards[0].error, error);
});

test("a completed enrollment reads every day complete on the card", () => {
  const card = createCourseCardViewModel({
    course,
    enrollment: {
      ...enrollmentReady,
      data: { enrolled: true, currentDay: 6, totalDays: 5 },
    },
  });

  assert.equal(card.status, "completed");
  assert.equal(card.progress?.completedDays, 5);
  assert.equal(card.progress?.percent, 100);
});

test("an unenrolled card carries no progress", () => {
  const card = createCourseCardViewModel({
    course,
    enrollment: { ...enrollmentReady, data: { enrolled: false } },
  });

  assert.equal(card.status, "notEnrolled");
  assert.equal(card.progress, null);
});

test("enrolled cards navigate to the course home", () => {
  const card = createCourseCardViewModel({
    course,
    enrollment: {
      ...enrollmentReady,
      data: { enrolled: true, currentDay: 2, totalDays: 5 },
    },
  });

  assert.deepEqual(resolveCardAction(card), {
    type: "navigate",
    to: "/app/courses/putting-course",
  });
});

test("not-enrolled and error cards open the access sheet", () => {
  const notEnrolled = createCourseCardViewModel({
    course,
    enrollment: { ...enrollmentReady, data: { enrolled: false } },
  });
  const failed = createCourseCardViewModel({
    course,
    enrollment: { ...enrollmentReady, error: new Error("failed") },
  });

  assert.deepEqual(resolveCardAction(notEnrolled), {
    type: "openSheet",
    courseId: "course-1",
    slug: "putting-course",
  });
  assert.equal(resolveCardAction(failed).type, "openSheet");
});

test("loading cards do nothing on click", () => {
  const card = createCourseCardViewModel({
    course,
    enrollment: { isPending: true },
  });

  assert.deepEqual(resolveCardAction(card), { type: "none" });
});
