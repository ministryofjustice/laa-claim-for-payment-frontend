import type { Page, Locator } from '@playwright/test';

/**
 * Page object for the choose upload page.
 */
export class ChooseUploadPage {
  private readonly page: Page;
  private readonly url: string;

  /**
   * Creates a choose upload page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.url = 'http://localhost:3000' + '/claims/1/choose-upload';
  }

  /**
   * Gets the page heading.
   *
   * @returns {Locator} The heading locator.
   */
  get heading(): Locator {
    return this.page.locator('h1, legend.govuk-fieldset__legend');
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
   * Navigates to the choose upload page.
   *
   * @returns {Promise<void>} Promise that resolves when navigation completes.
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Waits for the choose upload page to finish loading.
   *
   * @returns {Promise<void>} Promise that resolves when the page reaches network idle.
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
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