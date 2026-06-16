import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the POA successful submission page.
 */
export class PoaSubmissionSuccessfulPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {number} claimId The claim ID
   */
  constructor(page: Page, claimId: number) {
    super(page, `claims/${claimId}/poa-submitted`);
  }

  /**
   * Gets the h2
   * @returns {Locator} The h2 locator
   */
  get whatHappensNextHeading(): Locator {
    return this.page.locator('#main-content h2');
  }

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

  /**
   * get the third paragraph
   * @returns {Locator} The third paragraph
   */
  get thirdParagraph(): Locator {
    return this.getNthParagraph(2);
  }

  /**
   * get the fourth paragraph
   * @returns {Locator} The fourth paragraph
   */
  get fourthParagraph(): Locator {
    return this.getNthParagraph(3);
  }
}