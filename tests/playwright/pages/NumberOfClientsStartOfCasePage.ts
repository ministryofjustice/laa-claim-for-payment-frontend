import type { Locator, Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/QuestionPage.js";
import { RadioInput } from "#tests/playwright/pages/Components.js";

/**
 * Page object for the number of clients start of case page.
 */
export class NumberOfClientsStartOfCasePage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/number-of-clients-start-of-case`);
  }

  readonly radio = new RadioInput(this.page, "numberOfClientsStartOfCase");

  /**
   * get the 0 radio
   * @returns {Locator} The 0 radio
   */
  get zeroRadio(): Locator {
    return this.radio.getRadio("0");
  }

  /**
   * get the 1 radio
   * @returns {Locator} The 1 radio
   */
  get oneRadio(): Locator {
    return this.radio.getRadio("1");
  }

  /**
   * get the 2+ radio
   * @returns {Locator} The 2+ radio
   */
  get twoPlusRadio(): Locator {
    return this.radio.getRadio("2+");
  }
}