import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/base/BasePage.js";
import { claim2Id } from "#tests/playwright/factories/handlers/api.js";

/**
 * Page object for the internal server error page
 */
export class InternalServerErrorPage extends BasePage {

  /**
   * Creates an internal server error page object
   * @param {Page} page - The Playwright page instance
   */
  constructor(page: Page) {
    super(page, `claims/${claim2Id.toString()}`);
  }

  /**
   * get the first paragraph
   * @returns {Locator} The first paragraph
   */
  get firstParagraph(): Locator {
    return this.getNthParagraph(0);
  }
}