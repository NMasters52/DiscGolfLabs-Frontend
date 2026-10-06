import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeCourseDays,
  // @ts-expect-error Node's native type stripping requires the explicit extension.
} from "./course-days.ts";

test("sorts days ascending by dayNumber and renumbers from 1", () => {
  const days = normalizeCourseDays([
    { dayNumber: 2, title: "Two", description: "second" },
    { dayNumber: 1, title: "One", description: "first" },
  ]);

  assert.deepEqual(
    days.map((day) => [day.dayNumber, day.title]),
    [
      [1, "One"],
      [2, "Two"],
    ],
  );
  assert.deepEqual(
    days.map((day) => day.description),
    ["first", "second"],
  );
});

test("repairs non-contiguous numbering to 1..n", () => {
  const days = normalizeCourseDays([
    { dayNumber: 1, title: "One", description: null },
    { dayNumber: 4, title: "Four", description: null },
    { dayNumber: 2, title: "Two", description: null },
  ]);

  assert.deepEqual(
    days.map((day) => day.dayNumber),
    [1, 2, 3],
  );
  assert.equal(days[2].title, "Four");
});

test("returns an empty array for a missing or malformed days value", () => {
  assert.deepEqual(normalizeCourseDays(undefined), []);
  assert.deepEqual(normalizeCourseDays(null), []);
  assert.deepEqual(normalizeCourseDays("nope"), []);
});

test("falls back to a generic title when a day's title is missing or blank", () => {
  const days = normalizeCourseDays([
    { dayNumber: 2, description: "kept" },
    { dayNumber: 1, title: "   ", description: null },
  ]);

  assert.equal(days[0].title, "Day 1");
  assert.equal(days[1].title, "Day 2");
  assert.equal(days[1].description, "kept");
});
