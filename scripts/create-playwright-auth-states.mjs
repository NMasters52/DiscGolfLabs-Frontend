import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
process.loadEnvFile(path.join(root, ".env"));

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const verificationCode = process.env.PLAYWRIGHT_CLERK_TEST_CODE || "424242";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const stateDir = path.join(root, "playwright", ".auth");

const accounts = [
  {
    tier: "free",
    name: "John Doe",
    email: process.env.PLAYWRIGHT_FREE_EMAIL,
    userId: process.env.PLAYWRIGHT_FREE_CLERK_USER_ID,
  },
  {
    tier: "paid",
    name: "Jane Doe",
    email: process.env.PLAYWRIGHT_PAID_EMAIL,
    userId: process.env.PLAYWRIGHT_PAID_CLERK_USER_ID,
  },
];

for (const account of accounts) {
  if (!account.email || !account.userId) {
    throw new Error(
      `Missing ${account.tier} test account values in .env. Run scripts/setup-dgl-test-users.sh first.`,
    );
  }
}

mkdirSync(stateDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const account of accounts) {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(`${baseUrl}/sign-in`);
      await page.locator('input[name="identifier"]').fill(account.email);
      await page.getByRole("button", { name: "Continue", exact: true }).click();

      const codeInput = page.locator('input[autocomplete="one-time-code"]');
      await codeInput.waitFor({ timeout: 30_000 });
      await codeInput.click();
      await codeInput.pressSequentially(verificationCode, { delay: 50 });
      await page.waitForURL((url) => url.pathname.startsWith("/app/dashboard"), {
        timeout: 60_000,
      });
      await page.getByText(account.name, { exact: true }).waitFor();
      await page.getByText(account.email, { exact: true }).waitFor();

      const sessionCookie = (await context.cookies()).find(
        (cookie) => cookie.name === "__session",
      );
      if (!sessionCookie) {
        throw new Error(`No Clerk session cookie was created for ${account.tier}.`);
      }
      const payload = JSON.parse(
        Buffer.from(sessionCookie.value.split(".")[1], "base64url").toString(),
      );
      if (payload.sub !== account.userId) {
        throw new Error(
          `The ${account.tier} session belongs to a different Clerk user than the configured test account.`,
        );
      }

      const statePath = path.join(stateDir, `${account.tier}.json`);
      await context.storageState({ path: statePath });
      console.log(`Created ${path.relative(root, statePath)} for ${account.name}.`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
