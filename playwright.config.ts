import { defineConfig, devices } from '@playwright/test';

const TRY_ZER0 = 0;
const TRY_ONCE = 1;
const TRY_TWICE = 2;

export const PLAYWRIGHT_TEST_ENV = {
  BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000',
  API_URL:'http://localhost:8080/',
  SERVICE_NAME: 'Claim for Controlled Work'
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI ?? false),
  retries: process.env.CI === 'true' ? TRY_TWICE : TRY_ZER0,
  workers: process.env.CI === 'true' ? TRY_ONCE : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: process.env.CI === 'true' ? 'on' : 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'concurrently "yarn tsx scripts/stub-backend.ts" "yarn tsx scripts/test-server-with-msw.ts"',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: process.env.CI !== 'true',
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 60000,
    env: {
      ...process.env,
      ...PLAYWRIGHT_TEST_ENV,
      //TODO: for now disable auth for e2e tests
      AUTH_ENABLED: 'false',
      DISABLE_REDIS: 'true',
    },
  },
});
