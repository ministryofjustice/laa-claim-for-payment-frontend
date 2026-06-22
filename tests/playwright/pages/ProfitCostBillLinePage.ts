import type { Locator, Page } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/BasePage.js";

/**
 * Page object for the profit cost bill line page.
 */
export class ProfitCostBillLinePage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/poa/cpgfs-profit-cost-bill-line");
  }

  /**
   * get the page heading
   * @returns {Locator} The page heading
   */
  get heading(): Locator {
    return this.page.getByRole("heading", {
      name: "POA CPGFS profit cost bill line",
    });
  }

  /**
   * get the day input
   * @returns {Locator} The day input
   */
  get dayInput(): Locator {
    return this.page.getByLabel("Day");
  }

  /**
   * get the month input
   * @returns {Locator} The month input
   */
  get monthInput(): Locator {
    return this.page.getByLabel("Month");
  }

  /**
   * get the year input
   * @returns {Locator} The year input
   */
  get yearInput(): Locator {
    return this.page.getByLabel("Year");
  }

  /**
   * get the actual net profit cost excluding advocacy input
   * @returns {Locator} The actual net profit cost excluding advocacy input
   */
  get actualNetProfitCostExcludingAdvocacyInput(): Locator {
    return this.page.getByLabel("Actual net profit cost excluding advocacy");
  }

  /**
   * get the actual net advocacy costs input
   * @returns {Locator} The actual net advocacy costs input
   */
  get actualNetAdvocacyCostsInput(): Locator {
    return this.page.getByLabel("Actual net advocacy costs");
  }

  /**
   * get the yes VAT radio
   * @returns {Locator} The yes VAT radio
   */
  get vatYesRadio(): Locator {
    return this.page.getByLabel("Yes");
  }

  /**
   * get the no VAT radio
   * @returns {Locator} The no VAT radio
   */
  get vatNoRadio(): Locator {
    return this.page.getByLabel("No");
  }

  /**
   * get the fee earner name input
   * @returns {Locator} The fee earner name input
   */
  get feeEarnerNameInput(): Locator {
    return this.page.getByLabel("Fee earner name");
  }

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
   * fill the form with valid values
   */
  async fillValidForm(): Promise<void> {
    await this.dayInput.fill("27");
    await this.monthInput.fill("3");
    await this.yearInput.fill("2007");
    await this.actualNetProfitCostExcludingAdvocacyInput.fill("123.45");
    await this.actualNetAdvocacyCostsInput.fill("156.00");
    await this.vatYesRadio.check();
    await this.feeEarnerNameInput.fill("John Smith");
  }
}