import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the view claim page
 */
export class ViewClaimPage extends BasePage {

  /**
   * Creates a new view claim page object
   * @param {Page} page - The Playwright page instance
   * @param {number} id - the claim id
   */
  constructor(page: Page, id: number) {
    super(page, `claims/${id}`);
  }

  /**
   * get the summary table
   * @returns {Locator} The summary table locator
   */
  get summaryTable(): Locator {
    return this.page.locator('.govuk-summary-list');
  }
}