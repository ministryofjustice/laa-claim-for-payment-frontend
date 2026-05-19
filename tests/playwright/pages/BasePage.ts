import type { Locator, Page } from "@playwright/test";

/**
 * Base page with shared navigation + utilities
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly url: string;

  /**
   * Constructs the page object
   * @param {Page} page The Playwright page instance
   * @param {string} route Page route
   */
  constructor(page: Page, route: string) {
    this.page = page;
    this.url = `http://localhost:3000/${route}`;
  }

  /**
   * Navigate to a relative path
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Wait for page to finish loading
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Gets the main heading element
   * @returns {Locator} The main heading locator
   */
  get heading(): Locator {
    return this.page.locator('h1');
  }
}