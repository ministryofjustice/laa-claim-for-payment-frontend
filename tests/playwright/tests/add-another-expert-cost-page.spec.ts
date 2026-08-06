import { expect, test } from "../fixtures/index.js";
import { MultipleClientHearingsPage } from "#tests/playwright/pages/MultipleClientHearingsPage.js";
import {
  claim1Id,
  expertCostDraftClaim1Id,
} from "#tests/playwright/factories/handlers/api.js";
import { AddAnotherExpertCostPage } from "#tests/playwright/pages/AddAnotherExpertCostPage.js";

test.describe("Add another expert cost page", () => {
  test("displays the page", async ({
    page,
    checkAccessibility,
  }) => {
    const addAnotherExpertCostPage = new AddAnotherExpertCostPage(page, expertCostDraftClaim1Id);

    await addAnotherExpertCostPage.navigate();
    await addAnotherExpertCostPage.waitForLoad();

    await expect(addAnotherExpertCostPage.heading).toBeVisible();
    await expect(addAnotherExpertCostPage.heading).toHaveText("You have added an expert cost");
    await expect(addAnotherExpertCostPage.radio.yesRadio).toBeVisible();
    await expect(addAnotherExpertCostPage.radio.noRadio).toBeVisible();
    await expect(addAnotherExpertCostPage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to expert cost when Yes is selected", async ({ page }) => {
    const addAnotherExpertCostPage = new AddAnotherExpertCostPage(page, expertCostDraftClaim1Id);

    await addAnotherExpertCostPage.navigate();
    await addAnotherExpertCostPage.waitForLoad();

    await addAnotherExpertCostPage.radio.answerYes();
    await addAnotherExpertCostPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${expertCostDraftClaim1Id}/poa/expert-cost-details$`)
    );
  });

  test("redirects to evidence upload when No is selected", async ({ page }) => {
    const addAnotherExpertCostPage = new AddAnotherExpertCostPage(page, expertCostDraftClaim1Id);

    await addAnotherExpertCostPage.navigate();
    await addAnotherExpertCostPage.waitForLoad();

    await addAnotherExpertCostPage.radio.answerNo();
    await addAnotherExpertCostPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${expertCostDraftClaim1Id}/poa/evidence-upload$`)
    );
  });

  test("show an error summary when nothing is selected", async ({ page }) => {
    const addAnotherExpertCostPage = new AddAnotherExpertCostPage(page, expertCostDraftClaim1Id);

    await addAnotherExpertCostPage.navigate();
    await addAnotherExpertCostPage.waitForLoad();

    await addAnotherExpertCostPage.saveAndContinueButton.click();

    await expect(addAnotherExpertCostPage.errorSummary).toBeVisible();
    await expect(addAnotherExpertCostPage.errorSummary).toContainText("Select yes if you wish to add another expert cost");

    await expect(addAnotherExpertCostPage.inlineError).toBeVisible();
    await expect(addAnotherExpertCostPage.inlineError).toContainText("Select yes if you wish to add another expert cost");
  });
});