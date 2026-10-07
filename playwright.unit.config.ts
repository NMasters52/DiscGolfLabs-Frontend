import { defineConfig } from "@playwright/test";

// Pure function tests need no browser, app server, or login storage state.
export default defineConfig({
  testDir: "./unit",
  testMatch: "**/*.spec.js",
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "./unit/test-results",
});
