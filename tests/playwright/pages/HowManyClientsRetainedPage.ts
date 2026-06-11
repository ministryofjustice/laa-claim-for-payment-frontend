import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the how many clients retained page.
 */
export class HowManyClientsRetainedPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/poa/how-many-clients-retained");
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "How many clients are retained?",
    });
  }

  /**
   * get the none radio
   * @returns {Locator} The none radio
   */
  get noneRadio(): Locator {
    return this.page.getByLabel("0");
  }

  /**
   * get the one radio
   * @returns {Locator} The one radio
   */
  get oneRadio(): Locator {
    return this.page.getByLabel("1");
  }

  /**
   * get the more than two radio
   * @returns {Locator} The more than two radio
   */
  get moreThanTwoRadio(): Locator {
    return this.page.getByLabel("2+");
  }

  /**
   * get the save and continue button
   * @returns {Locator} The save and continue button
   */
  get saveAndContinueButton(): Locator {
    return this.page.getByRole("button", {
      name: "Save and continue",
    });
  }
}