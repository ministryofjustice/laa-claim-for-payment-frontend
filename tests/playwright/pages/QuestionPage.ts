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
}