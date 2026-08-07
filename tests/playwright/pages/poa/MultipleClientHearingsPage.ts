import type { Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";
import { YesNoInput } from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for the how many clients retained page.
 */
export class MultipleClientHearingsPage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/multiple-client-hearings`);
  }

  readonly radio = new YesNoInput(this.page, "multipleClientHearings");
}