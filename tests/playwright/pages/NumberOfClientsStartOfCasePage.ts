import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the number of clients start of case page.
 */
export class NumberOfClientsStartOfCasePage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/poa/number-of-clients-start-of-case");
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "How many clients did you have at the start of the case?",
    });
  }

  /**
   * get the 0 radio
   * @returns {Locator} The 0 radio
   */
  get zeroRadio(): Locator {
    return this.page.getByLabel("0");
  }

  /**
   * get the 1 radio
   * @returns {Locator} The 1 radio
   */
  get oneRadio(): Locator {
    return this.page.getByLabel("1");
  }

  /**
   * get the 2+ radio
   * @returns {Locator} The 2+ radio
   */
  get twoPlusRadio(): Locator {
    return this.page.getByLabel("2+");
  }

  /**
   * get save and continue button
   * @returns {Locator} The save and continue button
   */
  get saveAndContinueButton(): Locator {
    return this.page.getByRole("button", {
      name: "Save and continue",
    });
  }

  /**
   * get the validation error message
   * @returns {Locator} The validation error message
   */
  get errorSummary(): Locator {
    return this.page.locator(".govuk-error-summary");
  }

  /**
   * get the error summary
   * @returns {Locator} The error summary
   */
  get validationError(): Locator {
    return this.errorSummary.getByText(
      "Select how many clients you had at the start of the case",
    );
}
}