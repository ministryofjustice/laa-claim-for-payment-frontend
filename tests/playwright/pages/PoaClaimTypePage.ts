import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the POA claim type page.
 */
export class PoaClaimTypePage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/poa/claim-type");
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "What type of POA are you claiming?",
    });
  }

  /**
   * get the profit cost radio
   * @returns {Locator} The profit cost radio
   */
  get profitCostRadio(): Locator {
    return this.page.getByLabel("Profit cost");
  }

  /**
   * get the expert cost radio
   * @returns {Locator} The expert cost radio
   */
  get expertCostRadio(): Locator {
    return this.page.getByLabel("Expert cost");
  }

  /**
   * get the non expert disbursement radio
   * @returns {Locator} The non expert disbursement radio
   */
  get nonExpertDisbursementRadio(): Locator {
    return this.page.getByLabel("Non expert disbursement");
  }

  /**
   * get save and continue button
   * @returns {Locator} Save and continue button
   */
  get saveAndContinueButton(): Locator {
    return this.page.getByRole("button", {
      name: "Save and continue",
    });
  }

  /**
   * get save and come back later link
   * @returns {Locator} Save and come back later link
   */
  get saveAndComeBackLaterLink(): Locator {
    return this.page.getByRole("link", {
      name: "Save and come back later",
    });
  }
}