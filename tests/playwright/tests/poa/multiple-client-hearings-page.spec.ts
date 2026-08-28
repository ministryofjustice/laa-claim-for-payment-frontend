import { expect, test } from "../../fixtures/index.js";
import { MultipleClientHearingsPage } from "#tests/playwright/pages/poa/MultipleClientHearingsPage.js";
import { profitCostDraftClaim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("Multiple client hearings page", () => {
  test("displays the multiple client hearings page", async ({
    page,
    checkAccessibility,
  }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(
      page,
      profitCostDraftClaim1Id,
    );

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await expect(multipleClientHearingsPage.heading).toBeVisible();
    await expect(multipleClientHearingsPage.heading).toHaveText(
      "Have you attended at least one hearing where you have represented more than one client?",
    );
    await expect(multipleClientHearingsPage.radio.yesRadio).toBeVisible();
    await expect(multipleClientHearingsPage.radio.noRadio).toBeVisible();
    await expect(
      multipleClientHearingsPage.saveAndContinueButton,
    ).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to escaping the fixed fee route when Yes is selected", async ({
    page,
  }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(
      page,
      profitCostDraftClaim1Id,
    );

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await multipleClientHearingsPage.radio.answerYes();
    await multipleClientHearingsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${profitCostDraftClaim1Id}/poa/escaping-standard-fixed-fee$`),
    );
  });

  test("redirects to escaping the fixed fee route when NO is selected", async ({
    page,
  }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(
      page,
      profitCostDraftClaim1Id,
    );

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await multipleClientHearingsPage.radio.answerNo();
    await multipleClientHearingsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${profitCostDraftClaim1Id}/poa/escaping-standard-fixed-fee$`),
    );
  });
});