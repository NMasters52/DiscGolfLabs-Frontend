/**
 * Sidebar state on the Settings surfaces.
 *
 * Protocol rule: "Enumerate the shell before passing a visual check." These
 * specs assert the current Dashboard/Course navigation, the combined Account
 * and Settings destination, and the real Sign Out control.
 */
import { expect, test } from "@playwright/test";

import { signOutButton } from "./helpers";

for (const path of ["/app/settings", "/app/settings/security"] as const) {
  test.describe(`sidebar state on ${path}`, () => {
    test("exactly the Settings item is active", async ({ page }) => {
      await page
        .context()
        .addCookies([
          {
            name: "sidebar_state",
            value: "true",
            domain: "localhost",
            path: "/",
          },
        ]);
      await page.goto(path);

      const menuButtons = page.locator('[data-slot="sidebar-menu-button"]');
      await expect(menuButtons).toHaveCount(3);

      // The current primary links and Sign Out control, in order.
      await expect(menuButtons).toHaveText([/Dashboard/, /Course/, /Sign Out/], {
        useInnerText: true,
      });

      // Account & Settings is a combined destination, so its direct link
      // owns both Settings URLs through aria-current.
      const settingsItem = page.getByRole("link", {
        name: /Account & Settings/,
      });
      await expect(
        settingsItem,
        "the Settings destination should claim both Settings URLs",
      ).toHaveAttribute("aria-current", "page");
      await expect(
        settingsItem,
        "the expanded Settings card should have a structural active outline",
      ).toHaveClass(/outline-2/);
      await expect(
        settingsItem,
        "the expanded Settings card should use active text",
      ).toHaveClass(/text-sidebar-accent-foreground/);
      await expect(
        settingsItem,
        "the Settings card should retain its keyboard focus ring",
      ).toHaveClass(/focus-visible:ring-2/);
      await expect(
        settingsItem,
        "the Settings card should keep its own layout without a nav marker",
      ).not.toHaveClass(/before:/);

      const activeItems = page.locator(
        '[data-slot="sidebar-menu-button"][data-active="true"]',
      );
      await expect(
        activeItems,
        "primary destinations must not claim a Settings URL",
      ).toHaveCount(0);

      const toggleSidebar = page.locator('[data-slot="sidebar-trigger"]');
      await toggleSidebar.click();
      const collapsedSettings = page.getByRole("link", {
        name: /Account & Settings/,
      });
      await expect(
        collapsedSettings.locator('[data-slot="avatar"]'),
        "the collapsed Settings avatar should have a matching active ring",
      ).toHaveClass(/ring-2/);
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
