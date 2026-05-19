import type { Page, Locator } from '@playwright/test';
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the choose upload page.
 */
export class ChooseUploadPage extends BasePage {

  /**
   * Creates a choose upload page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, 'claims/1/choose-upload');
  }

  /**
   * Gets the choose upload form.
   *
   * @returns {Locator} The form locator.
   */
  get form(): Locator {
    return this.page.locator('form');
  }

  /**
   * Gets the continue button.
   *
   * @returns {Locator} The continue button locator.
   */
  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Save and continue' });
  }

  /**
   * Gets the error summary.
   *
   * @returns {Locator} The error summary locator.
   */
  get errorSummary(): Locator {
    return this.page.locator('.govuk-error-summary');
  }

  /**
   * Gets the inline error message.
   *
   * @returns {Locator} The inline error message locator.
   */
  get inlineError(): Locator {
    return this.page.locator('.govuk-error-message');
  }

  /**
   * Gets the all at once radio option.
   *
   * @returns {Locator} The all at once radio option locator.
   */
  get allAtOnceOption(): Locator {
    return this.page.locator('input[type="radio"][value="all-at-once"]');
  }

  /**
   * Gets the associated to line items radio option.
   *
   * @returns {Locator} The associated to line items radio option locator.
   */
  get associatedToLineItemsOption(): Locator {
    return this.page.locator('input[type="radio"][value="associated-to-line-items"]');
  }

  /**
   * Submits the choose upload form.
   *
   * @returns {Promise<void>} Promise that resolves when the submit action completes.
   */
  async submit(): Promise<void> {
    await this.continueButton.click();
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