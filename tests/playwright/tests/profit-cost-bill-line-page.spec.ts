import { expect, test } from "../fixtures/index.js";
import { ProfitCostBillLinePage } from "#tests/playwright/pages/ProfitCostBillLinePage.js";

test.describe("Profit cost bill line page", () => {
  test("displays the profit cost bill line page", async ({
    page,
    checkAccessibility,
  }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(page);

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await expect(profitCostBillLinePage.heading).toBeVisible();
    await expect(profitCostBillLinePage.dayInput).toBeVisible();
    await expect(profitCostBillLinePage.monthInput).toBeVisible();
    await expect(profitCostBillLinePage.yearInput).toBeVisible();
    await expect(
      profitCostBillLinePage.actualNetProfitCostExcludingAdvocacyInput,
    ).toBeVisible();
    await expect(profitCostBillLinePage.actualNetAdvocacyCostsInput).toBeVisible();
    await expect(profitCostBillLinePage.vatYesRadio).toBeVisible();
    await expect(profitCostBillLinePage.vatNoRadio).toBeVisible();
    await expect(profitCostBillLinePage.feeEarnerNameInput).toBeVisible();
    await expect(profitCostBillLinePage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to POA evidence upload when valid form is submitted", async ({
    page,
  }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(page);

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await profitCostBillLinePage.fillValidForm();
    await profitCostBillLinePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/claims\/1\/poa\/:lineItemId\/evidence-upload$/);
  });

  test("shows validation errors when empty form is submitted", async ({ page }) => {
    const profitCostBillLinePage = new ProfitCostBillLinePage(page);

    await profitCostBillLinePage.navigate();
    await profitCostBillLinePage.waitForLoad();

    await profitCostBillLinePage.saveAndContinueButton.click();

    await expect(
      page.getByText("Enter the activity date").first(),
    ).toBeVisible();
  });
});