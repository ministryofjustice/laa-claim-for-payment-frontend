import type { Locator, Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";
import { RadioInput } from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for the choose upload page.
 */
export class ChooseUploadPage extends QuestionPage {

  /**
   * Creates a choose upload page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/choose-upload`);
  }

  readonly radio = new RadioInput(this.page, "fileUploadChoice");

  /**
   * Gets the all at once radio option.
   *
   * @returns {Locator} The all at once radio option locator.
   */
  get allAtOnceOption(): Locator {
    return this.radio.getRadio("All at once");
  }

  /**
   * Gets the associated to line items radio option.
   *
   * @returns {Locator} The associated to line items radio option locator.
   */
  get associatedToLineItemsOption(): Locator {
    return this.radio.getRadio("Associated to specific line items");
  }

  /**
   * Selects the all at once radio option.
   *
   * @returns {Promise<void>} Promise that resolves when the option is selected.
   */
  async chooseAllAtOnce(): Promise<void> {
    await this.allAtOnceOption.check();
  }

  /**
   * Selects the associated to line items radio option.
   *
   * @returns {Promise<void>} Promise that resolves when the option is selected.
   */
  async chooseAssociatedToLineItems(): Promise<void> {
    await this.associatedToLineItemsOption.check();
  }
}