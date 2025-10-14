import { test, expect } from "@playwright/test";
import { mockGetClaim, defaultClaim } from "./mocks/claimsApi.js";


test("view claim page should have the correct title", async ({ page }) => {
  await mockGetClaim(page, defaultClaim);

  // Navigate to the homepage
  await page.goto("/claims/1");

  // Check for the title of the application
  await expect(page).toHaveTitle(/Claim for Controlled Work – GOV.UK/);
});

test("view claim page should display LAA header", async ({ page }) => {
  await mockGetClaim(page, defaultClaim);

  await page.goto("/claims/1");

  // Check for the header with LAA branding
  const header = page.getByRole("banner");
  await expect(header).toBeVisible();

  // Check for GOV.UK branding which is typically in the header
  //await expect(page.getByRole('link', { name: 'GOV.UK' })).toBeVisible();
});
