import type { Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { QuestionPage } from "#tests/playwright/pages/base/QuestionPage.js";
import { TextInput, YesNoInput } from "#tests/playwright/pages/base/Components.js";

/**
 * Page object for the profit cost bill line page.
 */
export class ProfitCostBillLinePage extends QuestionPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/cpgfs-profit-cost-bill-line`);
  }

  readonly dayInput = new TextInput(this.page, "activityDate-day")
  readonly monthInput = new TextInput(this.page, "activityDate-month")
  readonly yearInput = new TextInput(this.page, "activityDate-year")
  readonly actualNetProfitCostExcludingAdvocacyInput = new TextInput(this.page, "actualNetProfitCostExcludingAdvocacy")
  readonly actualNetAdvocacyCostsInput = new TextInput(this.page, "actualNetAdvocacyCosts")
  readonly vatRadio = new YesNoInput(this.page, "vatApplies");
  readonly feeEarnerNameInput = new TextInput(this.page, "feeEarnerName");

  /**
   * fill the form with valid values
   */
  async fillValidForm(): Promise<void> {
    await this.dayInput.input.fill("27");
    await this.monthInput.input.fill("3");
    await this.yearInput.input.fill("2007");
    await this.actualNetProfitCostExcludingAdvocacyInput.input.fill("123.45");
    await this.actualNetAdvocacyCostsInput.input.fill("156.00");
    await this.vatRadio.yesRadio.check();
    await this.feeEarnerNameInput.input.fill("John Smith");
  }
}