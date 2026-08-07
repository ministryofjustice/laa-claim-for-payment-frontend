import { expect, test } from "../../fixtures/index.js";
import { EscapingFixedFeePage } from "#tests/playwright/pages/poa/EscapingFixedFeePage.js";
import { claim1Id } from "#tests/playwright/factories/handlers/api.js";

test.describe("Escaping the fixed fee page", () => {
  test("displays the escaping the fixed fee page", async ({
    page,
    checkAccessibility,
  }) => {
    const escapingFixedFeePage = new EscapingFixedFeePage(page, claim1Id);

    await escapingFixedFeePage.navigate();
    await escapingFixedFeePage.waitForLoad();

    await expect(escapingFixedFeePage.heading).toBeVisible();
    await expect(escapingFixedFeePage.heading).toHaveText("Escaping the standard fixed fee");

    await expect(escapingFixedFeePage.radio.yesRadio).toBeVisible();
    await expect(escapingFixedFeePage.radio.noRadio).toBeVisible();
    await expect(escapingFixedFeePage.saveAndContinueButton).toBeVisible();

    await checkAccessibility();
  });

  test("displays escaping the fixed fee hint text", async ({
    page,
    checkAccessibility,
  }) => {
    const escapingFixedFeePage = new EscapingFixedFeePage(page, claim1Id);

    await escapingFixedFeePage.navigate();
    await escapingFixedFeePage.waitForLoad();

    await expect(
      page.getByText(
        "Some cases escape the standard fixed fee. For example, cases where:",
      ),
    ).toBeVisible();

    await expect(
      page.getByText("your client is an unsuccessful joined party"),
    ).toBeVisible();

    await expect(
      page.getByText(
        "the acting solicitor has been instructed for less than 24 hours overall and their involvement in the case has concluded",
      ),
    ).toBeVisible();

    await expect(
      page.getByText("your profit costs have exceeded the escape threshold."),
    ).toBeVisible();

    await expect(
      page.getByText("This is not an exhaustive list."),
    ).toBeVisible();

    await expect(
      page.getByText(
        "If we assess your claim and find that you have not escaped the standard fixed fee, you may have to repay any overpayments.",
      ),
    ).toBeVisible();

        await checkAccessibility();

  });

  test("redirects to CPGFS profit cost bill line page route when Yes is selected", async ({
    page,
  }) => {
    const escapingFixedFeePage = new EscapingFixedFeePage(page, claim1Id);

    await escapingFixedFeePage.navigate();
    await escapingFixedFeePage.waitForLoad();

    await escapingFixedFeePage.radio.answerYes();
    await escapingFixedFeePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/cpgfs-profit-cost-bill-line$`)
    );
  });

  test("redirects to CPGFS profit cost bill line page route when No is selected", async ({
    page,
  }) => {
    const escapingFixedFeePage = new EscapingFixedFeePage(page, claim1Id);

    await escapingFixedFeePage.navigate();
    await escapingFixedFeePage.waitForLoad();

    await escapingFixedFeePage.radio.answerNo();
    await escapingFixedFeePage.saveAndContinueButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/claims/${claim1Id}/poa/cpgfs-profit-cost-bill-line$`)
    );
  });
});
