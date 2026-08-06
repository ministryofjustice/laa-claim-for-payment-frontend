import type { Page } from "@playwright/test";
import type { UUID } from "#node_modules/uuidv7/dist/index.js";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";
import { YesNoInput } from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for escaping the fixed fee page.
 */
export class EscapingFixedFeePage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/escaping-standard-fixed-fee`);
  }

  readonly radio = new YesNoInput(this.page, "escapingFixedFee");
}