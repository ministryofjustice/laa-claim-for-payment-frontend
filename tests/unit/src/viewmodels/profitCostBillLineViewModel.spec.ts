import { expect } from "chai";
import {
  ProfitCostBillLineViewModel,
  ProfitCostBillLineViewModelParams,
} from "#src/viewmodels/profitCostBillLineViewModel.js";

describe("profitCostBillLineViewModel constructor", () => {
  it("constructs view model when form/errors undefined", () => {
    const params: ProfitCostBillLineViewModelParams = {
      claimId: 1,
    };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.profitCostBillLine.title");
    expect(result.form).to.deep.equal({
      activityDate: {
        value: {
          day: "",
          month: "",
          year: "",
        },
        error: undefined,
      },
      actualNetProfitCostExcludingAdvocacy: {
        value: "",
        error: undefined,
      },
      actualNetAdvocacyCosts: {
        value: "",
        error: undefined,
      },
      vatApplies: {
        fieldName: "vatApplies",
        choices: [
          {
            value: "yes",
            text: {
              key: "common.yes",
            },
            checked: false,
          },
          {
            value: "no",
            text: {
              key: "common.no",
            },
            checked: false,
          },
        ],
        error: undefined,
      },
      feeEarnerName: {
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
    const params: ProfitCostBillLineViewModelParams = {
      claimId: 1,
      form: {
        activityDateDay: "1",
        activityDateMonth: "1",
        activityDateYear: "2000",
        actualNetProfitCostExcludingAdvocacy: "100",
        actualNetAdvocacyCosts: "200",
        vatApplies: "yes",
        feeEarnerName: "Joe Bloggs",
      },
      errors: [
        {
          fieldName: "feeEarnerName",
          href: "#feeEarnerName",
          text: {
            key: "pages.profitCostBillLine.feeEarnerName.errors.empty",
          },
        },
      ],
    };

    const result = new ProfitCostBillLineViewModel(params);

    expect(result.claimId).to.equal(1);
    expect(result.title).to.equal("pages.profitCostBillLine.title");
    expect(result.form).to.deep.equal({
      activityDate: {
        value: {
          day: "1",
          month: "1",
          year: "2000",
        },
        error: undefined,
      },
      actualNetProfitCostExcludingAdvocacy: {
        value: "100",
        error: undefined,
      },
      actualNetAdvocacyCosts: {
        value: "200",
        error: undefined,
      },
      vatApplies: {
        fieldName: "vatApplies",
        choices: [
          {
            value: "yes",
            text: {
              key: "common.yes",
            },
            checked: true,
          },
          {
            value: "no",
            text: {
              key: "common.no",
            },
            checked: false,
          },
        ],
        error: undefined,
      },
      feeEarnerName: {
        value: "Joe Bloggs",
        error: {
          fieldName: "feeEarnerName",
          href: "#feeEarnerName",
          text: {
            key: "pages.profitCostBillLine.feeEarnerName.errors.empty",
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
            key: "pages.profitCostBillLine.feeEarnerName.errors.empty",
          },
          href: "#feeEarnerName",
        },
      ],
    });
  });
});