import {
  ExpertCostDetailsViewModel,
  ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { expect } from "chai";

describe("constructor", () => {
  it("constructs view model when form/errors undefined", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: 1,
      expertCostId: 1,
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.poa.expertCostDetails.title");
    expect(result.form).to.deep.equal({
      activityDate: {
        value: {
          day: "",
          month: "",
          year: "",
        },
        error: undefined,
      },
      actualNetValue: {
        value: "",
        error: undefined,
      },
      vatApplies: {
        value: "",
        error: undefined,
      },
      feeEarnerName: {
        value: "",
        error: undefined,
      },
      description: {
        value: "",
        error: undefined,
      },
    });
    expect(result.errorSummary).to.deep.equal({
      titleText: {
        key: "common.errorSummaryTitle",
      },
      errorList: [],
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
        description: "",
      },
      errors: [
        {
          fieldName: "description",
          href: "#description",
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty",
          },
        },
      ],
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.poa.expertCostDetails.title");
    expect(result.form).to.deep.equal({
      activityDate: {
        value: {
          day: "1",
          month: "1",
          year: "2000",
        },
        error: undefined,
      },
      actualNetValue: {
        value: "100",
        error: undefined,
      },
      vatApplies: {
        value: "yes",
        error: undefined,
      },
      feeEarnerName: {
        value: "Joe Bloggs",
        error: undefined,
      },
      description: {
        value: "",
        error: {
          fieldName: "description",
          href: "#description",
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty",
          },
        },
      },
    });
    expect(result.errorSummary).to.deep.equal({
      titleText: {
        key: "common.errorSummaryTitle",
      },
      errorList: [
        {
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty",
          },
          href: "#description",
        },
      ],
    });
  });
});