/**
 * The courses flow regression: the courses index, the per-course home, and
 * the completed-course path that used to be sealed shut.
 *
 * Before /app/courses/:slug existed, a completed enrollment (currentDay past
 * totalDays) was redirected from the learn index to the dashboard and had no
 * way back into the course. These specs pin the replacement behavior on both
 * projects: nicholas (paid/enrolled) and nick (unenrolled).
 *
 * The enrolled account's progress is live data, so assertions branch on the
 * rendered data-state rather than assuming a day number.
 */
import { expect, test } from "@playwright/test";

import {
  COURSES_INDEX_PATH,
  COURSE_HOME_PATH,
  COURSE_MARKETING_PATH,
  courseCards,
  dayRows,
  expectLearnEntryDestination,
  openWithTheme,
  settle,
} from "./helpers";

test.describe("courses index", () => {
  test("renders one card per course with live enrollment state", async ({
    page,
  }) => {
    await openWithTheme(page, COURSES_INDEX_PATH, "light");

    const card = courseCards(page).first();
    await expect(card).toBeVisible();
    // Enrollment checks resolve per card; until then the card stays loading.
    await expect(card).toHaveAttribute(
      "data-state",
      /notEnrolled|inProgress|completed/,
      { timeout: 20_000 },
    );
    await expect(
      card.locator('[data-slot="card-title"]'),
    ).not.toBeEmpty();
  });

  test("enrolled account opens the course home from the card", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "nicholas holds the paid/enrolled account",
    );

    await openWithTheme(page, COURSES_INDEX_PATH, "light");

    const card = courseCards(page).first();
    await expect(card).toHaveAttribute(
      "data-state",
      /inProgress|completed/,
      { timeout: 20_000 },
    );
    const cardState = await card.getAttribute("data-state");

    await card.click();
    await expect(page).toHaveURL(new RegExp(`${COURSE_HOME_PATH}$`));
    await expect(dayRows(page)).toHaveCount(5);

    if (cardState === "completed") {
      // The whole reason this page exists: 5/5 users get their course back,
      // with every day listed completed and open for review.
      await expect(page.locator('main [data-state="completed"]')).toBeVisible();
      for (let index = 0; index < 5; index += 1) {
        await expect(dayRows(page).nth(index)).toHaveAttribute(
          "data-status",
          "completed",
        );
      }
      await page.getByRole("link", { name: "Review Day 1" }).click();
    } else {
      // In progress: day 1 reviewed or current, nothing beyond the current
      // day is open, and the CTA continues the enrollment's current day.
      await expect(dayRows(page).nth(0)).toHaveAttribute(
        "data-status",
        /completed|current/,
      );
      await page.getByRole("link", { name: /Continue Day \d+|Start Day 1/ }).click();
    }

    await expect(page).toHaveURL(
      /\/app\/courses\/putting-course\/learn\/day\/\d+$/,
    );
  });

  test("unenrolled account gets the access sheet from the card, not a redirect", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick is the unenrolled account",
    );

    await openWithTheme(page, COURSES_INDEX_PATH, "light");

    const card = courseCards(page).first();
    await expect(card).toHaveAttribute("data-state", "notEnrolled", {
      timeout: 20_000,
    });
    const title = await card.locator('[data-slot="card-title"]').innerText();

    await card.click();
    const accessSheet = page.getByRole("dialog", { name: title });
    await expect(accessSheet).toBeVisible();
    await expect(
      accessSheet.getByRole("link", { name: "View Course" }),
    ).toBeVisible();

    await accessSheet.getByRole("link", { name: "View Course" }).click();
    await expect(page).toHaveURL(new RegExp(`${COURSE_MARKETING_PATH}$`));
  });

  test("unenrolled account renders the course home preview without a redirect", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick is the unenrolled account",
    );

    // Direct URLs stay safe outside the learn layout: the unenrolled variant
    // renders in place with locked days and the enroll path.
    await openWithTheme(page, COURSE_HOME_PATH, "light");

    await expect(page.locator('main [data-state="notEnrolled"]')).toBeVisible();
    await expect(dayRows(page)).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      await expect(dayRows(page).nth(index)).toHaveAttribute(
        "data-status",
        "locked",
      );
    }
    await expect(
      page.getByRole("link", { name: "View course & enroll" }),
    ).toBeVisible();
  });
});

test.describe("learn entry", () => {
  test("the learn index still routes in-progress and completed enrollments", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "the learn index authorizes enrollment",
    );

    await openWithTheme(page, "/app/courses/putting-course/learn", "light");
    await settle(page);

    await expectLearnEntryDestination(page);
  });
});
