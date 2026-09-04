/**
 * Sidebar state on the Settings surfaces.
 *
 * Protocol rule: "Enumerate the shell before passing a visual check." So these
 * specs assert the whole Account/Training/Games menu, not just the active item:
 * exactly one destination claims the URL, the rest opt out, and Sign Out is a
 * real, reachable button in the same list.
 */
import { expect, test } from "@playwright/test";

import { SIDEBAR_ITEMS, signOutButton } from "./helpers";

for (const path of ["/app/settings", "/app/settings/security"] as const) {
  test.describe(`sidebar state on ${path}`, () => {
    test("exactly the Settings item is active", async ({ page }) => {
      await page.goto(path);

      const menuButtons = page.locator('[data-slot="sidebar-menu-button"]');
      await expect(menuButtons).toHaveCount(SIDEBAR_ITEMS.length);

      // The whole shell, in order, so a missing or renamed item fails here.
      await expect(menuButtons).toHaveText(
        SIDEBAR_ITEMS.map((label) => new RegExp(label)),
        { useInnerText: true },
      );

      // data-active is the app's own notion of "this destination owns this
      // URL" (AppSidebar passes resolveDestination(pathname) into isActive).
      const settingsItem = page
        .locator('[data-slot="sidebar-menu-button"]')
        .filter({ hasText: "Settings" });
      await expect(
        settingsItem,
        "the Settings destination should claim both Settings URLs",
      ).toHaveAttribute("data-active", "true");

      const activeItems = page.locator(
        '[data-slot="sidebar-menu-button"][data-active="true"]',
      );
      await expect(
        activeItems,
        "no other destination may claim a Settings URL",
      ).toHaveCount(1);
      await expect(activeItems).toHaveText(/Settings/);
    });

    test("Sign Out is a visible, enabled button", async ({ page }) => {
      await page.goto(path);

      const signOut = signOutButton(page);
      await expect(signOut).toBeVisible();
      await expect(signOut).toBeEnabled();
      await expect(signOut).toContainText("Sign Out");

      // Read-only: the button is inside Clerk's <SignOutButton>, which would
      // end the session. This suite never activates it.
      await expect(signOut).toHaveAttribute("data-slot", "sidebar-menu-button");
    });
  });
}
