import { expect, test } from "@playwright/test";

import {
  COURSES_INDEX_PATH,
  courseCards,
  openWithTheme,
  settle,
  sidebar,
} from "./helpers";

test.describe("desktop Course access", () => {
  test("unenrolled account browses the index and chooses from the card sheet", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick holds the unpaid/unenrolled account",
    );

    await openWithTheme(page, "/app/dashboard", "light");

    // Courses is a real destination now: the sidebar link navigates.
    await sidebar(page).getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL(new RegExp(`${COURSES_INDEX_PATH}$`));

    const card = courseCards(page).first();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-state", "notEnrolled", {
      timeout: 20_000,
    });

    // The card's own title names the sheet — the title is data, not copy.
    const title = await card
      .locator('[data-slot="card-title"]')
      .innerText();
    await card.click();

    const accessSheet = page.getByRole("dialog", { name: title });
    await expect(page).toHaveURL(new RegExp(`${COURSES_INDEX_PATH}$`));
    await expect(accessSheet).toBeVisible();
    await expect(
      accessSheet.getByRole("button", { name: "Stay Here" }),
    ).toBeVisible();
    await expect(
      accessSheet.getByRole("link", { name: "View Course" }),
    ).toBeVisible();

    // Dismissing hands focus back to the card that opened the sheet.
    await accessSheet.getByRole("button", { name: "Stay Here" }).click();
    await expect(accessSheet).toBeHidden();
    await expect(card).toBeFocused();
  });

  test("the card sheet survives crossing the mobile breakpoint", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick holds the unpaid/unenrolled account",
    );

    await openWithTheme(page, COURSES_INDEX_PATH, "light");

    const card = courseCards(page).first();
    await expect(card).toHaveAttribute("data-state", "notEnrolled", {
      timeout: 20_000,
    });
    await card.click();

    const accessSheet = page.getByRole("dialog", {
      name: await card.locator('[data-slot="card-title"]').innerText(),
    });
    await expect(accessSheet).toBeVisible();

    // One page-level sheet at both widths: crossing 768px in either
    // direction keeps it open (and dismissible) instead of the shell
    // tearing it down at the breakpoint.
    await page.setViewportSize({ width: 735, height: 900 });
    await expect(accessSheet).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(accessSheet).toBeVisible();

    await accessSheet.getByRole("button", { name: "Stay Here" }).click();
    await expect(accessSheet).toBeHidden();
  });
});
