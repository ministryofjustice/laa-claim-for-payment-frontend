import { expect } from "chai";
import {
  ProfitCostBillLineViewModel,
  ProfitCostBillLineViewModelParams,
} from "#src/viewmodels/poa/profitCostBillLineViewModel.js";
import { V7Generator } from "uuidv7";
import {
  buildProfitCostBillLineForm,
  validateProfitCostBillLine,
} from "#src/helpers/profitCostBillLineValidation.js";
import { Category, ProfitCostBillLineItem } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";

describe("profitCostBillLineViewModel constructor", () => {
  const lineItemId = new V7Generator().generate();

  it("constructs view model when empty form", () => {
    const form = buildProfitCostBillLineForm(undefined);

    const params: ProfitCostBillLineViewModelParams = { form };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.title).to.equal("pages.profitCostBillLine.title");

    expect(result.activityDateInput.items[0].value).to.be.undefined;
    expect(result.activityDateInput.items[1].value).to.be.undefined;
    expect(result.activityDateInput.items[2].value).to.be.undefined;
    expect(result.actualNetProfitCostExcludingAdvocacyInput.value).to.be.undefined;
    expect(result.actualNetAdvocacyCostsInput.value).to.be.undefined;
    expect(result.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.be.undefined;
  });

  it("constructs view model when form populated", () => {
    const lineItem: ProfitCostBillLineItem = {
      id: lineItemId.toString(),
      title: "Title",
      category: Category.DISBURSEMENT,
      date: LocalDate.of(1, 1, 2026),
      evidenceItems: [],
      feeEarnerName: "Joe Bloggs",
      vatApplicable: true,
      actualNetValue: null,
      netProfitCostAmount: 123,
      netAdvocacyCostAmount: 456,
    };

    const form = buildProfitCostBillLineForm(lineItem);

    const params: ProfitCostBillLineViewModelParams = { form };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.title).to.equal("pages.profitCostBillLine.title");

    expect(result.activityDateInput.items[0].value).to.equal(1);
    expect(result.activityDateInput.items[1].value).to.equal(1);
    expect(result.activityDateInput.items[2].value).to.equal(2026);
    expect(result.actualNetProfitCostExcludingAdvocacyInput.value).to.equal(123);
    expect(result.actualNetAdvocacyCostsInput.value).to.equal(456);
    expect(result.vatApplicableRadios.items[0].checked).to.equal(true);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.equal("Joe Bloggs");
  });

  it("constructs view model when form has errors", () => {
    const form = validateProfitCostBillLine({
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
      actualNetProfitCostExcludingAdvocacy: "",
      actualNetAdvocacyCosts: "",
      vatApplies: "",
      feeEarnerName: "",
    });

    const params: ProfitCostBillLineViewModelParams = { form };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.title).to.equal("pages.profitCostBillLine.title");

    expect(result.errorSummary?.errorList).to.have.length(5);
  });
});
