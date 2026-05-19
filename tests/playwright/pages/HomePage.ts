import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the home page
 */
export class HomePage extends BasePage {

  /**
   * Creates a new home page object
   * @param {Page} page - The Playwright page instance
   */
  constructor(page: Page) {
    super(page, '');
  }

  /**
   * Gets the table element
   * @returns {Locator} The mountains table locator
   */
  get table(): Locator {
    return this.page.locator('table');
  }

  /**
   * Gets the mountains table caption
   * @returns {Locator} The table caption locator
   */
  get tableCaption(): Locator {
    return this.page.locator('caption');
  }

  /**
   * Gets a specific row by content
   * @param {string} content - The content to find
   * @returns {Locator} The table row locator for the specified content
   */
  getTableRow(content: string): Locator {
    return this.page.locator(`tr:has-text("${content}")`);
  }
}