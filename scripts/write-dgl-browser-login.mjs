import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const [tier, baseUrl, outputPath] = process.argv.slice(2);
if (!['free', 'paid'].includes(tier) || !baseUrl || !outputPath) {
  throw new Error('Usage: node write-dgl-browser-login.mjs <free|paid> <base-url> <output-file>');
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(root, '.env'));
const account = tier === 'free'
  ? { name: 'John Doe', email: process.env.PLAYWRIGHT_FREE_EMAIL }
  : { name: 'Jane Doe', email: process.env.PLAYWRIGHT_PAID_EMAIL };
const code = process.env.PLAYWRIGHT_CLERK_TEST_CODE || '424242';
if (!account.email) throw new Error(`Missing ${tier} test email in .env.`);

const script = `async (page) => {
  const account = ${JSON.stringify(account)};
  const baseUrl = ${JSON.stringify(baseUrl)};
  const code = ${JSON.stringify(code)};
  await page.waitForTimeout(1000);
  if (!(await page.getByText(account.email, { exact: true }).count())) {
    await page.goto(baseUrl + '/sign-in');
    await page.locator('input[name="identifier"]').fill(account.email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    const codeInput = page.locator('input[autocomplete="one-time-code"]');
    await codeInput.waitFor({ timeout: 30000 });
    await codeInput.click();
    await codeInput.pressSequentially(code, { delay: 50 });
    await page.waitForURL((url) => url.pathname.startsWith('/app/dashboard'), { timeout: 60000 });
  }
  await page.getByText(account.name, { exact: true }).waitFor({ timeout: 30000 });
  await page.getByText(account.email, { exact: true }).waitFor({ timeout: 30000 });
  return account.name + ' session ready';
}`;

writeFileSync(outputPath, script);
