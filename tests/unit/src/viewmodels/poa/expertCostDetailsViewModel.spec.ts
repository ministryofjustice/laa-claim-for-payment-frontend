import {
  ExpertCostDetailsViewModel,
  ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { expect } from "chai";
import { V7Generator } from "uuidv7";

describe("expertCostDetailsViewModel constructor", () => {

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();

  it("constructs view model when form/errors undefined", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: claimId,
      lineItemId: lineItemId,
    };

    const result = new ExpertCostDetailsViewModel(params);

    expect(result.claimId).to.equal(claimId.toString());
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
        fieldName: "vatApplies",
        fieldId: "vatApplies",
        choices: [
          {
            value: "yes",
            text: {
              key: "common.yes"
            },
            checked: false
          },
          {
            value: "no",
            text: {
              key: "common.no"
            },
            checked: false
          }
        ],
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
      claimId: claimId,
      lineItemId: lineItemId,
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

    expect(result.claimId).to.equal(claimId.toString());
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
        fieldName: "vatApplies",
        fieldId: "vatApplies",
        choices: [
          {
            value: "yes",
            text: {
              key: "common.yes"
            },
            checked: true
          },
          {
            value: "no",
            text: {
              key: "common.no"
            },
            checked: false
          }
        ],
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