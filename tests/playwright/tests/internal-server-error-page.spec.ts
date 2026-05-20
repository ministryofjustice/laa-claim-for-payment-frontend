import { test, expect } from '../fixtures/index.js';

test('internal server error page should have the correct title', async ({ page }) => {
	const response = await page.goto('/claims/2');

  if (!response) {
    throw new Error('No response returned from page.goto');
  }

  expect(response.status()).toBe(500);
	await expect(page).toHaveTitle('Sorry, there is a problem with the service – Claim for controlled work – GOV.UK');
});

test('internal server error page displays correct content', async ({ pages, checkAccessibility }) => {
  const page = pages.internalServerErrorPage();
  await page.navigate();
  await page.waitForLoad();

  await expect(page.heading).toBeVisible();
  await expect(page.heading).toHaveText('Sorry, there is a problem with the service');

  const firstParagraph = page.firstParagraph
  await expect(firstParagraph).toBeVisible();
  await expect(firstParagraph).toHaveText('Try again later.');

 await checkAccessibility();
});
