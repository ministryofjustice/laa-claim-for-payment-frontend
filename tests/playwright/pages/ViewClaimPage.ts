import type { Page, Locator } from '@playwright/test';

export class ViewClaimPage {
  private readonly page: Page;
  private readonly url: string;

  constructor(page: Page, id: number) {
    this.page = page;
    this.url = 'http://localhost:3000' + '/claims/' + id;
  }

  get heading(): Locator {
    return this.page.locator('h1.govuk-heading-xl');
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

  get summaryTable(): Locator {
    return this.page.locator('.govuk-summary-list');
  }

  /**
   * Gets the service name from the heading
   * @returns {Promise<string>} The service name text
   */
  async getServiceName(): Promise<string> {
    return await this.heading.textContent() || '';
  }

}