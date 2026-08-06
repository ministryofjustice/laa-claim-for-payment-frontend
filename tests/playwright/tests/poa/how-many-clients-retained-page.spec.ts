import { expect, test } from "../../fixtures/index.js";
import { HowManyClientsRetainedPage } from "#tests/playwright/pages/poa/HowManyClientsRetainedPage.js";
import { claim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("How many clients retained page", () => {
  test("displays the how many clients retained page", async ({
    page,
    checkAccessibility,
  }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page, claim1Id);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await expect(howManyClientsRetainedPage.heading).toBeVisible();
    await expect(howManyClientsRetainedPage.heading).toHaveText("How many clients are retained?");

    await expect(howManyClientsRetainedPage.noneRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.oneRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.moreThanTwoRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to none route when None is selected", async ({ page }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page, claim1Id);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.noneRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/number-of-clients-start-of-case$`)
    );
  });

  test("redirects to one route when One is selected", async ({ page }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page, claim1Id);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.oneRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/multiple-client-hearings$`)
    );
  });

  test("redirects to two route when More than two is selected", async ({
    page,
  }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page, claim1Id);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.moreThanTwoRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/multiple-client-hearings$`)
    );
  });
});