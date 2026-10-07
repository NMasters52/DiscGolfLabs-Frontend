/**
 * Playwright harness for the browser QA protocol's "hard proof beyond the MCP"
 * (docs/browser-qa-protocol.md).
 *
 * Lives at the repo root (not under `e2e/`) so that:
 *  - `npx playwright test` works from the root with no extra flags,
 *  - the `webServer` command (`npm run dev`) and its `cwd` are the package root,
 *  - specs import the app's real `documentTitle` helper with a plain relative
 *    path that resolves under the repo's own tsconfig (`../app/components/app/navigation`).
 *
 * Specs live in `e2e/`, artifacts in `e2e/test-results` + `e2e/playwright-report`,
 * visual baselines in `e2e/visual`. All three locations are documented in `e2e/.gitignore`
 * (`.auth/` is credentials and is ignored there too — never commit it).
 */
import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

// Fail early instead of erroring tests at context creation. These live Clerk
// sessions are credentials and stay under the ignored playwright/.auth folder.
for (const account of ["free", "paid"]) {
  const state = `playwright/.auth/${account}.json`;
  if (!existsSync(state)) {
    throw new Error(
      `Missing ${state}. Run npm run auth:setup to sign in as the dedicated ` +
        `${account} test user and create this Playwright state.`,
    );
  }
}

const PORT = 5173;
export const BASE_URL = `http://localhost:${PORT}`;

/** Fixed viewport so visual baselines and focus order are reproducible. */
const VIEWPORT = { width: 1440, height: 900 } as const;

/**
 * Playwright pins `prefers-color-scheme: light` by default. We pin it *on
 * purpose*: theme under test is driven by `localStorage.theme` (next-themes),
 * never by the OS signal, so a stale OS appearance can't leak into a run and
 * "System" resolves identically on every machine. See the protocol's
 * emulateMedia lesson.
 */
const COLOR_SCHEME = "light" as const;

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.spec.ts",
  // Each test gets its own page; theme/localStorage mutations stay isolated.
  fullyParallel: true,
  // Both projects run the same specs; the free/paid split is the point.
  projects: [
    {
      name: "free",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/free.json",
        viewport: VIEWPORT,
        colorScheme: COLOR_SCHEME,
      },
    },
    {
      name: "paid",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/paid.json",
        viewport: VIEWPORT,
        colorScheme: COLOR_SCHEME,
      },
    },
  ],
  use: {
    baseURL: BASE_URL,
    // System Chromium locally: no browser download, matches CLI exploration.
    // CI runners only ship bundled Chromium, so fall back to it there.
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
        (!process.env.CI && existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    video: "off",
  },
  expect: { timeout: 10_000 },
  // Keep the whole run well under two minutes; each project is independent.
  workers: 4,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  outputDir: "e2e/test-results",
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "e2e/playwright-report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "e2e/playwright-report", open: "never" }]],
  // Only the element screenshot baseline is stored, in a flat per-spec folder.
  // `{platform}` keeps a darwin baseline from being reused by a Linux CI run.
  // Deliberately no `{projectName}`: the sidebar shell is account-independent
  // by design, so one baseline is compared against both accounts and any
  // account-specific content leaking into the shell fails the run.
  snapshotPathTemplate: "{snapshotDir}/{testFileName}/{arg}-{platform}{ext}",
  snapshotDir: "e2e/visual",
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
