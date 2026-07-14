import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";
import type { UUID } from "#node_modules/uuidv7/dist/index.js";

/**
 * Page object for escaping the fixed fee page.
 */
export class EscapingFixedFeePage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/escaping-standard-fixed-fee`);
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "Escaping the standard fixed fee",
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