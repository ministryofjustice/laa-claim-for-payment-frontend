import { expect, test } from "../fixtures/index.js";
import { HowManyClientsRetainedPage } from "#tests/playwright/pages/HowManyClientsRetainedPage.js";

test.describe("How many clients retained page", () => {
  test("displays the how many clients retained page", async ({
    page,
    checkAccessibility,
  }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await expect(howManyClientsRetainedPage.heading).toBeVisible();
    await expect(howManyClientsRetainedPage.noneRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.oneRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.moreThanTwoRadio).toBeVisible();
    await expect(howManyClientsRetainedPage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("redirects to none route when None is selected", async ({ page }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.noneRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/none$/);
  });

  test("redirects to one route when One is selected", async ({ page }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.oneRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/one$/);
  });

  test("redirects to two route when More than two is selected", async ({
    page,
  }) => {
    const howManyClientsRetainedPage = new HowManyClientsRetainedPage(page);

    await howManyClientsRetainedPage.navigate();
    await howManyClientsRetainedPage.waitForLoad();

    await howManyClientsRetainedPage.moreThanTwoRadio.check();
    await howManyClientsRetainedPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(/\/two$/);
  });
});