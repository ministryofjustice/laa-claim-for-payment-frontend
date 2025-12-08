import type { Page } from '@playwright/test';
import { HomePage } from './HomePage.js';
import { ViewClaimPage } from './ViewClaimPage.js'

/**
 * Factory class for creating page objects
 */
export class PageFactory {
  private readonly page: Page;

  /**
   * Creates a new page factory instance
   * @param {Page} page - The Playwright page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * gets the home page for test
   * @returns { HomePage } the home page
   */
  get homePage(): HomePage {
    return new HomePage(this.page);
  }

  /**
   * gets the view claim page for test
   * @param { number } id the claim id
   * @returns { ViewClaimPage } the claim page for given id
   */
  viewClaimPage(id: number): ViewClaimPage {
    return new ViewClaimPage(this.page, id);
  }
}