import type { Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the POA check details page.
 */
export class PoaCheckDetailsPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {number} claimId The claim ID
   */
  constructor(page: Page, claimId: number) {
    super(page, `claims/${claimId}/poa/check-details`);
  }
}