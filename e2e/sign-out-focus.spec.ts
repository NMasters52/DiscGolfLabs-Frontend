/**
 * Sign Out keyboard focus indicator (issue #12 regression guard).
 *
 * Protocol rule: "Reachable focus is not visible focus." QA #12 found Sign Out
 * tab-reachable and :focus-visible while its focused styles were byte-identical
 * to its resting styles. So this spec asserts the delta, not just reachability:
 *  - Sign Out is the 8th keyboard stop from the top of the page,
 *  - while keyboard-focused it matches :focus-visible,
 *  - the focused box-shadow carries the current sidebar ring (2px),
 *  - after blur the resting box-shadow is back to none.
 * Run in both appearances; Tailwind's dark: variants could break either side.
 */
import { expect, test } from "@playwright/test";

import {
  boxShadowOf,
  focusedBoxShadow,
  openWithTheme,
  SIGN_OUT_TAB_INDEX,
  signOutButton,
  tabToSignOut,
  THEMES,
} from "./helpers";

/** The sidebar focus ring is a non-transparent 2px box-shadow token. */
const RING_PATTERN =
  /(?:rgb|rgba)\((?!0,\s*0,\s*0,\s*0\))[^)]+\)\s+0(?:px)?\s+0(?:px)?\s+0(?:px)?\s+2px/;

for (const theme of THEMES) {
  test(`Sign Out focus indicator in ${theme} mode`, async ({ page }) => {
    await openWithTheme(page, "/app/settings", theme);
    await expect(signOutButton(page)).toBeVisible();

    const { stops, index } = await tabToSignOut(page);

    // Evidence: the observed focus order travels with the failure message.
    expect(
      index,
      `Sign Out should be keyboard stop #${SIGN_OUT_TAB_INDEX}; observed ` +
        `focus order ${JSON.stringify(stops)}`,
    ).toBe(SIGN_OUT_TAB_INDEX);

    const signOut = signOutButton(page);

    // Reachable *and* visibly indicated.
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.matches(":focus-visible")),
      ),
      "the keyboard-focused Sign Out button must match :focus-visible",
    ).toBe(true);

    const focused = await focusedBoxShadow(page);
    expect(
      focused,
      `keyboard-focused Sign Out in ${theme} mode should carry a 2px ` +
        `sidebar ring`,
    ).toMatch(RING_PATTERN);

    // Blur and confirm the indicator disappears again — the protocol's actual
    // lesson is the delta, so read the resting state only once focus is gone.
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await expect(signOut).not.toBeFocused();

    const resting = await boxShadowOf(page, signOut);
    expect(
      resting,
      `Sign Out in ${theme} mode must not keep its ring after blur; the ` +
        `focused shadow was ${focused}`,
    ).toBe("none");
    expect(focused, "focused and resting styles must differ").not.toBe(resting);
  });
}

/**
 * The ring belongs to keyboard focus only: a pointer click on the sidebar's
 * *Settings* link (never Sign Out) must not leave a focus ring behind.
 */
test("pointer focus does not show the keyboard ring", async ({ page }) => {
  await openWithTheme(page, "/app/settings", "light");

  // Assert the link really took focus, otherwise the ring check below could
  // pass vacuously with focus still on <body> and a box-shadow of "none".
  const settingsLink = page.getByRole("link", { name: "Settings" });
  await settingsLink.click();
  await expect(settingsLink).toBeFocused();

  const shadow = await boxShadowOf(page, settingsLink);
  expect(
    shadow,
    "clicking a sidebar item should not paint the keyboard focus ring",
  ).not.toMatch(RING_PATTERN);
});
