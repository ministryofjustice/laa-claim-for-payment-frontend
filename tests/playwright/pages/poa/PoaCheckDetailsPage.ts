import type { Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/base/BasePage.js";
import type { UUID } from "uuidv7";

/**
 * Page object for the POA check details page.
 */
export class PoaCheckDetailsPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/check-details`);
  }
}