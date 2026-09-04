/**
 * Browser tab titles.
 *
 * The protocol requires a *runtime* read of `document.title` — a code grep is
 * not evidence. Each spec navigates for real and compares the live title
 * against `documentTitle(path)` imported from the app's own
 * `app/components/app/navigation.ts`, so a title can only drift if the app's
 * helper itself changes.
 *
 * The course day route is split out below because it is enrollment-gated:
 * enrolled nicholas renders it inside the shell, unenrolled nick is
 * redirected to the marketing page. Both behaviors are asserted, so the
 * suite stays green without weakening either check.
 */
import { expect, test } from "@playwright/test";

import {
  APP_NAME,
  COURSE_DAY_PATH,
  COURSE_MARKETING_PATH,
  documentTitle,
  settle,
  signOutButton,
  TITLE_PATHS,
} from "./helpers";

for (const path of TITLE_PATHS) {
  test.describe(`title ${path}`, () => {
    test(`equals documentTitle("${path}")`, async ({ page }) => {
      await page.goto(path);
      // Settle first: reading earlier can catch a title that a route guard is
      // about to replace, which would make this test pass on a transient
      // value. Nothing here is a fixed sleep — network idle is the signal.
      await settle(page);

      // The title is assigned by app code after hydration, so read it with a
      // retrying assertion rather than a single snapshot.
      await expect(
        page,
        `document.title for ${path} must equal the app's own documentTitle(). ` +
          `A mismatch is either title drift or a client-side redirect moving ` +
          `the user off ${path} — the log below shows the title that rendered.`,
      ).toHaveTitle(documentTitle(path));

      // The shell has to be there too: a title on an error page is not a pass.
      await expect(signOutButton(page)).toBeVisible();
    });
  });
}

test.describe(`title ${COURSE_DAY_PATH}`, () => {
  test("enrolled account sees the destination title inside the shell", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "nicholas holds the paid/enrolled account; nick's behavior is the next test",
    );

    await page.goto(COURSE_DAY_PATH);
    await settle(page);

    await expect(
      page,
      "an enrolled account must keep the course route (no redirect) and get " +
        "its destination title",
    ).toHaveTitle(documentTitle(COURSE_DAY_PATH));
    await expect(signOutButton(page)).toBeVisible();
  });

  test("unenrolled account is redirected to the marketing page title", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick is the unenrolled account; nicholas's behavior is the previous test",
    );

    await page.goto(COURSE_DAY_PATH);
    await settle(page);

    // The enrollment guard moves the user to the public marketing page, whose
    // title is the bare product name — the AppShell unmount reset, working as
    // designed. If this ever fails because nick enrolled, update the accounts
    // table in docs/browser-qa-protocol.md and swap this test's expectations.
    await expect(page).toHaveURL(new RegExp(`${COURSE_MARKETING_PATH}$`));
    await expect(page).toHaveTitle(APP_NAME);
    await expect(signOutButton(page)).toHaveCount(0);
  });
});
