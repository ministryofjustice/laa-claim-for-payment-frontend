import type { Locator } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the not found page
 */
export class NotFoundPage extends BasePage {

  /**
   * get the first paragraph
   * @returns {Locator} The first paragraph
   */
  get firstParagraph(): Locator {
    return this.getNthParagraph(0);
  }

  /**
   * get the second paragraph
   * @returns {Locator} The second paragraph
   */
  get secondParagraph(): Locator {
    return this.getNthParagraph(1);
  }
}