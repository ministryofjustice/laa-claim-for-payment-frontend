import type {Locator, Page} from "@playwright/test";
import type {UUID} from "uuidv7";
import {QuestionPage} from "#tests/playwright/pages/base/QuestionPage.js";
import {RadioInput} from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for the how many clients retained page.
 */
export class HowManyClientsRetainedPage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/how-many-clients-retained`);
  }

  readonly radio = new RadioInput(this.page, "howManyClientsRetained");

  /**
   * get the none radio
   * @returns {Locator} The none radio
   */
  get noneRadio(): Locator {
    return this.radio.getRadio("0");
  }

  /**
   * get the one radio
   * @returns {Locator} The one radio
   */
  get oneRadio(): Locator {
    return this.radio.getRadio("1");
  }

  /**
   * get the more than two radio
   * @returns {Locator} The more than two radio
   */
  get moreThanTwoRadio(): Locator {
    return this.radio.getRadio("2+");
  }
}