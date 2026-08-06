import type { Locator } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Base question page with shared navigation + utilities
 */
export abstract class QuestionPage extends BasePage {
  /**
   * get the save and continue button
   * @returns {Locator} The save and continue button
   */
  get saveAndContinueButton(): Locator {
    return this.page.getByRole("button", {
      name: "Save and continue",
    });
  }

  /**
   * Gets the error summary.
   *
   * @returns {Locator} The error summary locator.
   */
  get errorSummary(): Locator {
    return this.page.locator(".govuk-error-summary");
  }

  /**
   * Gets the inline error message.
   *
   * @returns {Locator} The inline error message locator.
   */
  get inlineError(): Locator {
    return this.page.locator(".govuk-error-message");
  }

  /**
   * Submits the form.
   *
   * @returns {Promise<void>} Promise that resolves when the submit action completes.
   */
  async submit(): Promise<void> {
    await this.saveAndContinueButton.click();
  }

  /**
   * Gets the form.
   *
   * @returns {Locator} The form locator.
   */
  get form(): Locator {
    return this.page.locator("form");
  }
}
