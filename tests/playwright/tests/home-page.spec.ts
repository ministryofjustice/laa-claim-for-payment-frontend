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
	await page.goto('/');

	// Check for the title of the application
	await expect(page).toHaveTitle(/Claim for Controlled Work – GOV.UK/);
});

test('home page displays service name and table', async ({ pages, checkAccessibility }) => {
  const homePage = pages.homePage;
  
  // Navigate to home page
  await homePage.navigate();
  await homePage.waitForLoad();
  
  // Test the service name heading is present
  await expect(homePage.heading).toBeVisible();
  const serviceName = await homePage.getServiceName();
  expect(serviceName).toBeTruthy();
  
  // Test the mountains table is displayed
  await expect(homePage.table).toBeVisible();
  const row = homePage.getTableRow('Giordano');
  await expect(row).toBeVisible();
  await expect(row).toContainText('Family');
  await expect(row).toContainText('18/03/2025');
  await expect(row).toContainText('Escape');
  await expect(row).toContainText('£234.56');
  
  // Run accessibility check
  await checkAccessibility();
});
