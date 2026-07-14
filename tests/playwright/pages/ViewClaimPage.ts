import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";
import type { UUID } from "uuidv7";

/**
 * Page object for the view claim page
 */
export class ViewClaimPage extends BasePage {

  /**
   * Creates a new view claim page object
   * @param {Page} page - The Playwright page instance
   * @param {UUID} id - the claim id
   */
  constructor(page: Page, id: UUID) {
    super(page, `claims/${id.toString()}`);
  }

  /**
   * get the summary table
   * @returns {Locator} The summary table locator
   */
  get summaryTable(): Locator {
    return this.page.locator('.govuk-summary-list');
  }
}