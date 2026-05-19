import { test, expect } from '../fixtures/index.js';

test('not found should have the correct title', async ({ page }) => {
	const response = await page.goto('/missing');

  if (!response) {
    throw new Error('No response returned from page.goto');
  }

  expect(response.status()).toBe(404);
	await expect(page).toHaveTitle('Page not found – Claim for controlled work – GOV.UK');
});

test('not found page displays correct content', async ({ pages, checkAccessibility }) => {
  const page = pages.notFoundPage("missing");
  await page.navigate();
  await page.waitForLoad();

  await expect(page.heading).toBeVisible();
  await expect(page.heading).toHaveText('Page not found');

  const firstParagraph = page.firstParagraph
  await expect(firstParagraph).toBeVisible();
  await expect(firstParagraph).toHaveText('If you typed the web address, check it is correct.');

  const secondParagraph = page.secondParagraph
  await expect(secondParagraph).toBeVisible();
  await expect(secondParagraph).toHaveText('If you pasted the web address, check you copied the entire address.');

 await checkAccessibility();
});
