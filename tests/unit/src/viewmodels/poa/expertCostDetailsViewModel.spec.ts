import {
  ExpertCostDetailsViewModel,
  ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { expect } from "chai";
import { V7Generator } from "uuidv7";
import {
  buildExpertCostDetailsForm,
  validateExpertCostDetails,
} from "#src/helpers/expertCostDetailsValidation.js";
import { Category, ExpertCostLineItem } from "#src/types/Claim.js";
import { LocalDate } from "#src/types/date.js";
import { validateProfitCostBillLine } from "#src/helpers/profitCostBillLineValidation.js";
import {
  ProfitCostBillLineViewModel,
  ProfitCostBillLineViewModelParams,
} from "#src/viewmodels/poa/profitCostBillLineViewModel.js";

describe("expertCostDetailsViewModel constructor", () => {
  const lineItemId = new V7Generator().generate();

  it("constructs view model when empty form", () => {
    const form = buildExpertCostDetailsForm(undefined);

    const params: ExpertCostDetailsViewModelParams = {
      form,
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.title).to.equal("pages.poa.expertCostDetails.title");

    expect(result.activityDateInput.items[0].value).to.be.undefined;
    expect(result.activityDateInput.items[1].value).to.be.undefined;
    expect(result.activityDateInput.items[2].value).to.be.undefined;
    expect(result.actualNetValueInput.value).to.be.undefined;
    expect(result.vatApplicableRadios.items[0].checked).to.equal(false);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.be.undefined;
    expect(result.descriptionInput.value).to.be.undefined;
  });

  it("constructs view model when populated form", () => {
    const lineItem: ExpertCostLineItem = {
      id: lineItemId.toString(),
      title: "Title",
      category: Category.DISBURSEMENT,
      date: LocalDate.of(1, 1, 2026),
      evidenceItems: [],
      feeEarnerName: "Joe Bloggs",
      vatApplicable: true,
      actualNetValue: 123,
      netProfitCostAmount: null,
      netAdvocacyCostAmount: null,
    };

    const form = buildExpertCostDetailsForm(lineItem);

    const params: ExpertCostDetailsViewModelParams = { form };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.title).to.equal("pages.poa.expertCostDetails.title");

    expect(result.activityDateInput.items[0].value).to.equal(1);
    expect(result.activityDateInput.items[1].value).to.equal(1);
    expect(result.activityDateInput.items[2].value).to.equal(2026);
    expect(result.actualNetValueInput.value).to.equal(123);
    expect(result.vatApplicableRadios.items[0].checked).to.equal(true);
    expect(result.vatApplicableRadios.items[1].checked).to.equal(false);
    expect(result.feeEarnerNameInput.value).to.equal("Joe Bloggs");
    expect(result.descriptionInput.value).to.equal("Title");
  });

  it("constructs view model when form has errors", () => {
    const form = validateExpertCostDetails({
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
      actualNetValue: "",
      vatApplies: "",
      feeEarnerName: "",
      description: "",
    });

    const params: ExpertCostDetailsViewModelParams = { form };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.errorSummary?.errorList).to.have.length(5);
  });
});
