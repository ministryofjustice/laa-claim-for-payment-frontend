import { expect, test } from "../fixtures/index.js";
import { PoaClaimTypePage } from "#tests/playwright/pages/PoaClaimTypePage.js";
import { claim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("POA claim type page", () => {
  test("displays the POA claim type page", async ({
    page,
    checkAccessibility,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, claim1Id);

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
    const poaClaimTypePage = new PoaClaimTypePage(page, claim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.profitCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/profit-cost-details$`)
    );
  });

  test("redirects to expert cost details when Expert cost is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, claim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.expertCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/expert-cost-details/1$`)
    );
  });

  test("redirects to non expert disbursement when Non expert disbursement is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, claim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.nonExpertDisbursementRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/non-expert-disbursement$`)
    );
  });
});