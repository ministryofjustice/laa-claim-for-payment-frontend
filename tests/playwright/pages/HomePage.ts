import type { Page, Locator } from '@playwright/test';

/**
 * Page object for the home page
 */
export class HomePage {
  private readonly page: Page;
  private readonly url: string;

  /**
   * Creates a new home page object
   * @param {Page} page - The Playwright page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.url ='http://localhost:3000' + '/';
  }

  /**
   * Gets the main heading element
   * @returns {Locator} The main heading locator
   */
  get heading(): Locator {
    return this.page.locator('h1.govuk-heading-xl');
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

  /**
   * Navigates to the home page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Waits for the page to fully load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Gets the service name from the heading
   * @returns {Promise<string>} The service name text
   */
  async getServiceName(): Promise<string> {
    return await this.heading.textContent() ?? '';
  }

}