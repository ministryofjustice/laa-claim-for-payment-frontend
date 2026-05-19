import { test, expect } from '../fixtures/index.js';

test('homepage should have the correct title', async ({ page }) => {
	// Navigate to the homepage
	await page.goto('/');

	// Check for the title of the application
	await expect(page).toHaveTitle("Your Claims – Claim for controlled work – GOV.UK");
});

test('home page displays service name and table', async ({ pages, checkAccessibility }) => {
  const page = pages.homePage;
  
  // Navigate to home page
  await page.navigate();
  await page.waitForLoad();
  
  // Test the service name heading is present
  await expect(page.heading).toBeVisible();
  await expect(page.heading).toHaveText('Your Claims');
  
  // The table is displayed
  await expect(page.table).toBeVisible();
  const row = page.getTableRow('LAA-001');
  await expect(row).toBeVisible();
  await expect(row).toContainText('Family');
  await expect(row).toContainText('18/03/2025');
  await expect(row).toContainText('Escape');
  await expect(row).toContainText('£234.56');
  
  //the other rows are displayed
  const row2 = page.getTableRow('LAA-002');
  await expect(row2).toBeVisible();
  const row3 = page.getTableRow('LAA-003');
  await expect(row3).toBeVisible();

  // Run accessibility check
  await checkAccessibility();
});
