import { expect } from "chai";
import {
  ProfitCostBillLineViewModel,
  ProfitCostBillLineViewModelParams,
} from "#src/viewmodels/poa/profitCostBillLineViewModel.js";
import { LocalDate } from "#src/types/date.js";
import { ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import type { ProfitCostBillLine } from "#src/types/poa.js";

describe("profitCostBillLineViewModel constructor", () => {
  it("constructs view model when empty form", () => {
    const form = new ProfitCostBillLineForm();

    const params: ProfitCostBillLineViewModelParams = { form };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.title).to.equal("pages.profitCostBillLine.title");

    expect(result.activityDateInput.items[0].value).to.be.undefined;
    expect(result.activityDateInput.items[1].value).to.be.undefined;
    expect(result.activityDateInput.items[2].value).to.be.undefined;
    expect(result.actualNetProfitCostExcludingAdvocacyInput.value).to.be
      .undefined;
    expect(result.actualNetAdvocacyCostsInput.value).to.be.undefined;
    expect(result.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.be.undefined;
  });

  it("constructs view model when form populated", () => {
    const lineItem: ProfitCostBillLine = {
      activityDate: LocalDate.of(1, 1, 2026),
      vatApplies: true,
      actualNetProfitCostExcludingAdvocacy: 123,
      actualNetAdvocacyCosts: 456,
      feeEarnerName: "Joe Bloggs",
    };

    const form = new ProfitCostBillLineForm();
    form.fill(lineItem);

    const params: ProfitCostBillLineViewModelParams = { form };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.title).to.equal("pages.profitCostBillLine.title");

    expect(result.activityDateInput.items[0].value).to.equal(1);
    expect(result.activityDateInput.items[1].value).to.equal(1);
    expect(result.activityDateInput.items[2].value).to.equal(2026);
    expect(result.actualNetProfitCostExcludingAdvocacyInput.value).to.equal(
      123,
    );
    expect(result.actualNetAdvocacyCostsInput.value).to.equal(456);
    expect(result.vatApplicableRadios.items[0].checked).to.equal(true);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.equal("Joe Bloggs");
  });

  it("constructs view model when form has errors", () => {
    const form = new ProfitCostBillLineForm();

    form.validate({
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

    expect(result.activityDateInput.items[0].value).to.equal("");
    expect(result.activityDateInput.items[1].value).to.equal("");
    expect(result.activityDateInput.items[2].value).to.equal("");
    expect(result.actualNetProfitCostExcludingAdvocacyInput.value).to.equal("");
    expect(result.actualNetAdvocacyCostsInput.value).to.equal("");
    expect(result.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.equal("");
  });
});
