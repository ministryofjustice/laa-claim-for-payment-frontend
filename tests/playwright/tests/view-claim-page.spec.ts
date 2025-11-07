import { test, expect } from '../fixtures/index.js';

test.beforeEach(async ({ page }) => {
  // stub ALL /api/* calls so nothing hits your backend
  await page.route('**/api/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }) // change per test if needed
    })
  );

  // (optional) log what the app tries to call so you can tailor the stub
  page.on('request', r => {
    const u = r.url();
    if (u.includes('/api/')) console.log('API:', r.method(), u);
  });
});

test('homepage should have the correct title', async ({ page }) => {
	// Navigate to the homepage
	await page.goto('/claims/1');

	// Check for the title of the application
	await expect(page).toHaveTitle(/Claim for Controlled Work – GOV.UK/);
});

test('home page displays service name and table', async ({ pages, checkAccessibility }) => {
  const page = pages.viewClaimPage(1);
  await page.navigate();
  await page.waitForLoad();
  
  // Test the service name heading is present
  await expect(page.heading).toBeVisible();
  const serviceName = await page.getServiceName();
  expect(serviceName).toBeTruthy();

  await expect(page.heading).toContainText('LAA-001')
  const summary = page.summaryTable
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('£234.56');
    
  // Run accessibility check
  await checkAccessibility();
});
