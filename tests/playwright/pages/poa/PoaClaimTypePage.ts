import type { Locator, Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";
import { RadioInput } from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for the POA claim type page.
 */
export class PoaClaimTypePage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/claim-type`);
  }

  readonly radio = new RadioInput(this.page, "poaClaimType");

  /**
   * get the profit cost radio
   * @returns {Locator} The profit cost radio
   */
  get profitCostRadio(): Locator {
    return this.radio.getRadio("Profit cost");
  }

  /**
   * get the expert cost radio
   * @returns {Locator} The expert cost radio
   */
  get expertCostRadio(): Locator {
    return this.radio.getRadio("Expert cost");
  }

  /**
   * get the non expert disbursement radio
   * @returns {Locator} The non expert disbursement radio
   */
  get nonExpertDisbursementRadio(): Locator {
    return this.radio.getRadio("Non expert disbursement");
  }
}