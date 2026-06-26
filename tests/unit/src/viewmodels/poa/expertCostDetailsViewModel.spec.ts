import { ExpertCostDetailsViewModel, ExpertCostDetailsViewModelParams } from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { expect } from "chai";

describe("constructor", () => {
  it("constructs view model when form/errors undefined", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: 1,
      expertCostId: 1
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.poa.expertCostDetails.title");
    expect(result.form).to.deep.equal({
      activityDateDay: "",
      activityDateMonth: "",
      activityDateYear: "",
      actualNetValue: "",
      vatApplies: "",
      feeEarnerName: "",
      description: "",
      activityDateError: undefined,
      actualNetValueError: undefined,
      vatAppliesError: undefined,
      feeEarnerNameError: undefined,
      descriptionError: undefined,
    });
    expect(result.errorSummary).to.deep.equal({
      titleText: {
        key: "common.errorSummaryTitle"
      },
      errorList: []
    });
  });

  it("constructs view model when form/errors defined", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: 1,
      expertCostId: 1,
      form: {
        activityDateDay: "1",
        activityDateMonth: "1",
        activityDateYear: "2000",
        actualNetValue: "100",
        vatApplies: "yes",
        feeEarnerName: "Joe Bloggs",
        description: ""
      },
      errors: [
        {
          fieldName: "description",
          href: "#description",
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty"
          }
        }
      ]
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.poa.expertCostDetails.title");
    expect(result.form).to.deep.equal({
      activityDateDay: "1",
      activityDateMonth: "1",
      activityDateYear: "2000",
      actualNetValue: "100",
      vatApplies: "yes",
      feeEarnerName: "Joe Bloggs",
      description: "",
      activityDateError: undefined,
      actualNetValueError: undefined,
      vatAppliesError: undefined,
      feeEarnerNameError: undefined,
      descriptionError: {
        fieldName: "description",
        href: "#description",
        text: {
          key: "pages.poa.expertCostDetails.description.errors.empty"
        }
      },
    });
    expect(result.errorSummary).to.deep.equal({
      titleText: {
        key: "common.errorSummaryTitle"
      },
      errorList: [
        {
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty"
          },
          href: "#description",
        }
      ]
    });
  });
});