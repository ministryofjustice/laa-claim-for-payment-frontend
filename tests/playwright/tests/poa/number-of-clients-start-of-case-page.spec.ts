import { expect, test } from "../../fixtures/index.js";
import { NumberOfClientsStartOfCasePage } from "#tests/playwright/pages/poa/NumberOfClientsStartOfCasePage.js";
import { profitCostDraftClaim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("Number of clients start of case page", () => {
  test("displays the number of clients start of case page", async ({
    page,
    checkAccessibility,
  }) => {
    const numberOfClientsPage = new NumberOfClientsStartOfCasePage(
      page,
      profitCostDraftClaim1Id,
    );

    await numberOfClientsPage.navigate();
    await numberOfClientsPage.waitForLoad();

    await expect(numberOfClientsPage.heading).toBeVisible();
    await expect(numberOfClientsPage.heading).toHaveText(
      "How many clients did you have at the start of the case?",
    );
    await expect(numberOfClientsPage.zeroRadio).toBeVisible();
    await expect(numberOfClientsPage.oneRadio).toBeVisible();
    await expect(numberOfClientsPage.twoPlusRadio).toBeVisible();
    await expect(numberOfClientsPage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("shows validation error when no option is selected", async ({
    page,
  }) => {
    const numberOfClientsPage = new NumberOfClientsStartOfCasePage(
      page,
      profitCostDraftClaim1Id,
    );

    await numberOfClientsPage.navigate();
    await numberOfClientsPage.waitForLoad();

    await numberOfClientsPage.saveAndContinueButton.click();

    await expect(numberOfClientsPage.errorSummary).toBeVisible();
    await expect(numberOfClientsPage.errorSummary).toContainText(
      "Select how many clients you had at the start of the case",
    );

    await expect(numberOfClientsPage.inlineError).toBeVisible();
    await expect(numberOfClientsPage.inlineError).toContainText(
      "Select how many clients you had at the start of the case",
    );
  });

  test("redirects to multiple client hearings when 0 is selected", async ({
    page,
  }) => {
    const numberOfClientsPage = new NumberOfClientsStartOfCasePage(
      page,
      profitCostDraftClaim1Id,
    );

    await numberOfClientsPage.navigate();
    await numberOfClientsPage.waitForLoad();

    await numberOfClientsPage.zeroRadio.check();
    await numberOfClientsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${profitCostDraftClaim1Id}/poa/multiple-client-hearings$`),
    );
  });

  test("redirects to multiple client hearings when 1 is selected", async ({
    page,
  }) => {
    const numberOfClientsPage = new NumberOfClientsStartOfCasePage(
      page,
      profitCostDraftClaim1Id,
    );

    await numberOfClientsPage.navigate();
    await numberOfClientsPage.waitForLoad();

    await numberOfClientsPage.oneRadio.check();
    await numberOfClientsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(
        `/claims/${profitCostDraftClaim1Id}/poa/multiple-client-hearings$`,
      ),
    );
  });

  test("redirects to multiple client hearings when 2+ is selected", async ({
    page,
  }) => {
    const numberOfClientsPage = new NumberOfClientsStartOfCasePage(
      page,
      profitCostDraftClaim1Id,
    );

    await numberOfClientsPage.navigate();
    await numberOfClientsPage.waitForLoad();

    await numberOfClientsPage.twoPlusRadio.check();
    await numberOfClientsPage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${profitCostDraftClaim1Id}/poa/multiple-client-hearings$`),
    );
  });
});