import { expect, test } from "../fixtures/index.js";
import { PoaClaimTypePage } from "#tests/playwright/pages/PoaClaimTypePage.js";

test.describe("POA claim type page", () => {
  test("displays the POA claim type page", async ({
    page,
    checkAccessibility,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await expect(poaClaimTypePage.heading).toBeVisible();
    await expect(poaClaimTypePage.profitCostRadio).toBeVisible();
    await expect(poaClaimTypePage.expertCostRadio).toBeVisible();
    await expect(poaClaimTypePage.nonExpertDisbursementRadio).toBeVisible();
    await expect(poaClaimTypePage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to profit cost details when Profit cost is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.profitCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/claims\/1\/poa\/profit-cost-details$/);
  });

  test("redirects to expert cost details when Expert cost is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.expertCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/claims\/1\/poa\/expert-cost-details\/1$/);
  });

  test("redirects to non expert disbursement when Non expert disbursement is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.nonExpertDisbursementRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/claims\/1\/poa\/non-expert-disbursement$/);
  });
});