import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/QuestionPage.js";
import { RadioInput, YesNoInput } from "#tests/playwright/pages/Components.js";

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