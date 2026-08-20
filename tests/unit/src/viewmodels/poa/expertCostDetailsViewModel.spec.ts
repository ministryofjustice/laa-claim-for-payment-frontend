import {
  ExpertCostDetailsViewModel,
  ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { expect } from "chai";
import { LocalDate } from "#src/types/date.js";
import { ExpertCostDetailsForm } from "#src/helpers/expertCostDetailsValidation.js";
import { ExpertCostDetails } from "#src/types/poa.js";

describe("expertCostDetailsViewModel constructor", () => {
  it("constructs view model when empty form", () => {
    const form = new ExpertCostDetailsForm();

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
    const lineItem: ExpertCostDetails = {
      activityDate: LocalDate.of(1, 1, 2026),
      actualNetValue: 123,
      vatApplies: true,
      feeEarnerName: "Joe Bloggs",
      description: "Title",
    };

    const form = new ExpertCostDetailsForm();
    form.fill(lineItem);

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
    const form = new ExpertCostDetailsForm();

    form.validate({
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
