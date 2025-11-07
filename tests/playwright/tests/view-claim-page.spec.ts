import { test, expect } from '../fixtures/index.js';

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
