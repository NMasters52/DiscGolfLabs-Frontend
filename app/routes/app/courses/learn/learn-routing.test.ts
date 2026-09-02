import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { getEnrollmentDestination } from "./enrollment-redirect.ts";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { getLearnDayRedirect } from "./redirect.ts";

test("sends an unenrolled visitor to the public course page", () => {
  assert.equal(
    getEnrollmentDestination({
      courseSlug: "putting-course",
      enrolled: false,
    }),
    "/courses/putting-course",
  );
});

test("keeps an enrolled visitor in the learn flow", () => {
  assert.equal(
    getEnrollmentDestination({
      courseSlug: "putting-course",
      enrolled: true,
    }),
    null,
  );
});

test("returns to the learn index for invalid or locked days", () => {
  for (const dayNumber of ["not-a-day", "0", "6"]) {
    assert.equal(
      getLearnDayRedirect({
        dayNumber,
        currentDay: 2,
        totalDays: 5,
      }),
      "..",
    );
  }
});

test("does not redirect for a permitted day", () => {
  assert.equal(
    getLearnDayRedirect({
      dayNumber: "2",
      currentDay: 2,
      totalDays: 5,
    }),
    null,
  );
});
