import { expect, test } from "../../fixtures/index.js";
import { PoaClaimTypePage } from "#tests/playwright/pages/poa/PoaClaimTypePage.js";
import {
  claim1Id,
  expertCostDraftClaim1Id,
  expertCostDraftClaim2Id,
  nonExpertDisbursementDraftClaim1Id
} from "#tests/playwright/factories/handlers/api.js";

test.describe("POA claim type page", () => {
  test("displays the POA claim type page", async ({
    page,
    checkAccessibility,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, claim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await expect(poaClaimTypePage.heading).toBeVisible();
    await expect(poaClaimTypePage.heading).toHaveText("What type of POA are you claiming?");
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

  test("redirects to add disbursement when Expert cost is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, expertCostDraftClaim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.expertCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${expertCostDraftClaim1Id}/poa/disbursement-details$`)
    );
  });

  test("redirects to add disbursement when Non expert disbursement is selected", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, nonExpertDisbursementDraftClaim1Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.nonExpertDisbursementRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${nonExpertDisbursementDraftClaim1Id}/poa/disbursement-details$`)
    );
  });

  test("redirects to add another disbursement when line items already present", async ({
    page,
  }) => {
    const poaClaimTypePage = new PoaClaimTypePage(page, expertCostDraftClaim2Id);

    await poaClaimTypePage.navigate();
    await poaClaimTypePage.waitForLoad();

    await poaClaimTypePage.expertCostRadio.check();
    await poaClaimTypePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${expertCostDraftClaim2Id}/poa/disbursement-details/add$`)
    );
  });
});