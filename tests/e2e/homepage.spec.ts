import { getClaimsResponseData } from "#tests/assets/getClaimsResponseData.js";
import { test, expect } from "@playwright/test";

test("homepage should have the correct title", async ({ page }) => {
  await page.route("**/claims", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(getClaimsResponseData),
    });
  });

  // Navigate to the homepage
  await page.goto("/");

  // Check for the title of the application
  await expect(page).toHaveTitle(/Claim for Controlled Work – GOV.UK/);
});

test("homepage should display LAA header", async ({ page }) => {
  await page.route("**/claims", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(getClaimsResponseData),
    });
  });
  await page.goto("/");

  // Check for the header with LAA branding
  const header = page.getByRole("banner");
  await expect(header).toBeVisible();

  // Check for GOV.UK branding which is typically in the header
  //await expect(page.getByRole('link', { name: 'GOV.UK' })).toBeVisible();
});
