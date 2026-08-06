import { expect, test } from "../../fixtures/index.js";
import { ProfitCostBillLinePage } from "#tests/playwright/pages/poa/ProfitCostBillLinePage.js";
import { profitCostDraftClaim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("Profit cost bill line page", () => {
  test("displays the profit cost bill line page", async ({
    page,
    checkAccessibility,
  }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(
      page,
      profitCostDraftClaim1Id,
    );

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await expect(profitCostBillLinePage.heading).toBeVisible();
    await expect(profitCostBillLinePage.heading).toHaveText("POA CPGFS profit cost bill line");
    await expect(profitCostBillLinePage.dayInput.input).toBeVisible();
    await expect(profitCostBillLinePage.monthInput.input).toBeVisible();
    await expect(profitCostBillLinePage.yearInput.input).toBeVisible();
    await expect(
      profitCostBillLinePage.actualNetProfitCostExcludingAdvocacyInput.input,
    ).toBeVisible();
    await expect(
      profitCostBillLinePage.actualNetAdvocacyCostsInput.input,
    ).toBeVisible();
    await expect(profitCostBillLinePage.vatRadio.yesRadio).toBeVisible();
    await expect(profitCostBillLinePage.vatRadio.noRadio).toBeVisible();
    await expect(profitCostBillLinePage.feeEarnerNameInput.input).toBeVisible();
    await expect(profitCostBillLinePage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to POA evidence upload when valid form is submitted", async ({
    page,
  }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(
      page,
      profitCostDraftClaim1Id,
    );

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await profitCostBillLinePage.fillValidForm();
    await profitCostBillLinePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${profitCostDraftClaim1Id}/poa/evidence-upload$`),
    );
  });

  test("shows validation errors when empty form is submitted", async ({
    page,
  }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(
      page,
      profitCostDraftClaim1Id,
    );

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await profitCostBillLinePage.saveAndContinueButton.click();

    await expect(
      page.getByText("Enter the activity date").first(),
    ).toBeVisible();
  });
});