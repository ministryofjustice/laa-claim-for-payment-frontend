import { expect, test } from "../../fixtures/index.js";
import {
  claim1Id,
  profitCostDraftClaim1Id,
} from "#tests/playwright/factories/handlers/api.js";

test("page should have the correct title", async ({ page }) => {
  await page.goto(`/claims/${profitCostDraftClaim1Id}/poa/check-details`);

  await expect(page).toHaveTitle(
    "Check your details – Claim for controlled work – GOV.UK",
  );
});

test("page displays the correct content", async ({
  pages,
  checkAccessibility,
}) => {
  const page = pages.poaCheckDetailsPage(profitCostDraftClaim1Id);

  await page.navigate();
  await page.waitForLoad();

  const heading = page.heading;
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Check your details");

  await checkAccessibility();
});
