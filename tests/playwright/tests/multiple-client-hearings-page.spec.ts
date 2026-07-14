import { expect, test } from "../fixtures/index.js";
import { MultipleClientHearingsPage } from "#tests/playwright/pages/MultipleClientHearingsPage.js";
import { claim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("Multiple client hearings page", () => {
  test("displays the multiple client hearings page", async ({
    page,
    checkAccessibility,
  }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(page, claim1Id);

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await expect(multipleClientHearingsPage.heading).toBeVisible();
    await expect(multipleClientHearingsPage.yesRadio).toBeVisible();
    await expect(multipleClientHearingsPage.noRadio).toBeVisible();
    await expect(multipleClientHearingsPage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to escaping the fixed fee route when Yes is selected", async ({ page }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(page, claim1Id);

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await multipleClientHearingsPage.yesRadio.check();
    await multipleClientHearingsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/escaping-standard-fixed-fee$`)
    );
  });

  test("redirects to escaping the fixed fee route when NO is selected", async ({ page }) => {
    const multipleClientHearingsPage = new MultipleClientHearingsPage(page, claim1Id);

    await multipleClientHearingsPage.navigate();
    await multipleClientHearingsPage.waitForLoad();

    await multipleClientHearingsPage.noRadio.check();
    await multipleClientHearingsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/escaping-standard-fixed-fee$`)
    );
  });
});