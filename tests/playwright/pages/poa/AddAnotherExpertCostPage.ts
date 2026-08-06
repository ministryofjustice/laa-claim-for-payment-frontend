import type { Page } from "@playwright/test";
import type { UUID } from "#node_modules/uuidv7/dist/index.js";
import { YesNoInput } from "#tests/playwright/pages/base/Components.js";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";

/**
 * Page object for adding another expert cost.
 */
export class AddAnotherExpertCostPage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/expert-cost-details/add`);
  }

  readonly radio = new YesNoInput(this.page, "add-another");
}