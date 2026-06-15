import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the how many clients retained page.
 */
export class MultipleClientHearingsPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/poa/multiple-client-hearings");
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "Have you attended at least one hearing where you have represented more than one client?",
    });
  }

  /**
   * get the yes radio
   * @returns {Locator} The yes radio
   */
  get yesRadio(): Locator {
    return this.page.getByLabel("Yes");
  }

  /**
   * get the no radio
   * @returns {Locator} The no radio
   */
  get noRadio(): Locator {
    return this.page.getByLabel("No");
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