/**
 * Optional visual baseline for the persistent sidebar shell.
 *
 * The protocol's "hard proof beyond the MCP" is a checked-in element snapshot
 * that fails on drift. The computed-style specs above are the real proof —
 * this one only catches what those miss (spacing, icon weight, borders), so it
 * is deliberately narrow: one element screenshot of the sidebar in one theme,
 * with the dynamic streak block masked out.
 *
 * Re-baseline deliberately: `npx playwright test --update-snapshots`.
 */
import { expect, test } from "@playwright/test";

import { openWithTheme, settle, sidebar, waitForFonts } from "./helpers";

test("sidebar shell matches its baseline in light mode", async ({ page }) => {
  await openWithTheme(page, "/app/settings", "light");
  // Let Clerk's profile card finish mounting so nothing lands in the frame
  // half-drawn, then wait for the Inter webfont.
  await settle(page);
  await waitForFonts(page);

  await expect(
    sidebar(page),
    "the persistent sidebar shell is pixel-stable in light mode",
  ).toHaveScreenshot("settings-sidebar-light.png", {
    // Anything that changes on its own between runs gets masked rather than
    // loosening the whole diff: the whole streak block (its number becomes
    // real data eventually, and the footer is not under test), and any
    // Clerk-injected UI that may overlap the viewport edge.
    mask: [
      page.locator('[data-sidebar="footer"]'),
      page.locator("clerk-dev-mode-warning, #clerk-dev-mode-warning"),
    ],
    maxDiffPixelRatio: 0.02,
    animations: "disabled",
    caret: "hide",
  });
});
