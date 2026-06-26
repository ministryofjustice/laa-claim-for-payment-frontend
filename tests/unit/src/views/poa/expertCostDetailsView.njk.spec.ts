import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";
import {
  ExpertCostDetailsViewModel,
  ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/expertCostDetailsView.njk", () => {
  let $: CheerioAPI;

  describe("view with no errors", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: 1,
      expertCostId: 1,
    };

    const viewModel = new ExpertCostDetailsViewModel(params);

    beforeEach(async () => {
      $ = await renderView("main/poa/expertCostDetailsView.njk", {
        vm: viewModel,
      });
    });

    it("renders a Back link", () => {
      const back = $("a.govuk-back-link");

      expect(back).to.have.length(1);
      expect(back.text().trim()).to.equal("common.back");
      expect(back.attr("href")).to.equal("#");
    });

    it("renders an h1", () => {
      const h1s = $("#main-content h1");
      expect(h1s).to.have.length(1);
      const h1 = h1s.first();
      expect(h1.text().trim()).to.equal("pages.poa.expertCostDetails.title");
    });

    it("renders an input for the activity date", () => {
      const input = $("#main-content .govuk-date-input#activity-date");
      expect(input).to.have.length(1);
      const dayInput = $("#main-content .govuk-input#activity-date-day");
      expect(dayInput).to.have.length(1);
      const monthInput = $("#main-content .govuk-input#activity-date-month");
      expect(monthInput).to.have.length(1);
      const yearInput = $("#main-content .govuk-input#activity-date-year");
      expect(yearInput).to.have.length(1);
    });

    it("renders an input for the actual net value", () => {
      const input = $("#main-content .govuk-input#actual-net-value");
      expect(input).to.have.length(1);
    });

    it("renders an input for whether VAT applies", () => {
      const yesInput = $("#main-content .govuk-radios__input#vat-applies");
      expect(yesInput).to.have.length(1);
      const noInput = $("#main-content .govuk-radios__input#vat-applies-2");
      expect(noInput).to.have.length(1);
    });

    it("renders an input for the fee earner name", () => {
      const input = $("#main-content .govuk-input#fee-earner-name");
      expect(input).to.have.length(1);
    });

    it("renders an input for the description", () => {
      const input = $("#main-content .govuk-textarea#description");
      expect(input).to.have.length(1);
    });
  });

  describe("view with errors", () => {
    const params: ExpertCostDetailsViewModelParams = {
      claimId: 1,
      expertCostId: 1,
      form: {
        activityDateDay: "",
        activityDateMonth: "",
        activityDateYear: "",
        actualNetValue: "",
        vatApplies: "",
        feeEarnerName: "",
        description: "",
      },
      errors: [
        {
          fieldName: "activityDate",
          href: "#activity-date-day",
          text: {
            key: "pages.poa.expertCostDetails.activityDate.errors.empty"
          },
          fields: ["day", "month", "year"],
        },
        {
          fieldName: "actualNetValue",
          href: "#actual-net-value",
          text: {
            key: "pages.poa.expertCostDetails.actualNetValue.errors.empty"
          },
        },
        {
          fieldName: "vatApplies",
          href: "#vat-applies",
          text: {
            key: "pages.poa.expertCostDetails.vatApplies.errors.empty"
          },
        },
        {
          fieldName: "feeEarnerName",
          href: "#fee-earner-name",
          text: {
            key: "pages.poa.expertCostDetails.feeEarnerName.errors.empty"
          },
        },
        {
          fieldName: "description",
          href: "#description",
          text: {
            key: "pages.poa.expertCostDetails.description.errors.empty"
          },
        }
      ]
    };

    const viewModel = new ExpertCostDetailsViewModel(params);

    beforeEach(async () => {
      $ = await renderView("main/poa/expertCostDetailsView.njk", {
        vm: viewModel,
      });
    });

    it("renders an error summary", () => {
      const errorSummary = $("#main-content .govuk-error-summary");
      expect(errorSummary).to.have.length(1);
      const errorSummaryList = errorSummary.find(".govuk-error-summary__list");
      const errorSummaryListItems = errorSummaryList.find("li");
      expect(errorSummaryListItems).to.have.length(5);
    });

    it("renders an error for the activity date", () => {
      const dayInput = $("#main-content .govuk-input--error#activity-date-day");
      expect(dayInput).to.have.length(1);
      const monthInput = $("#main-content .govuk-input--error#activity-date-month");
      expect(monthInput).to.have.length(1);
      const yearInput = $("#main-content .govuk-input--error#activity-date-year");
      expect(yearInput).to.have.length(1);

      const error = $("#main-content .govuk-error-message#activity-date-error");
      expect(error).to.have.length(1);
    });

    it("renders an error for the actual net value", () => {
      const input = $("#main-content .govuk-input--error#actual-net-value");
      expect(input).to.have.length(1);

      const error = $("#main-content .govuk-error-message#actual-net-value-error");
      expect(error).to.have.length(1);
    });

    it("renders an error for whether VAT applies", () => {
      const error = $("#main-content .govuk-error-message#vat-applies-error");
      expect(error).to.have.length(1);
    });

    it("renders an error for the fee earner name", () => {
      const input = $("#main-content .govuk-input--error#fee-earner-name");
      expect(input).to.have.length(1);

      const error = $("#main-content .govuk-error-message#fee-earner-name-error");
      expect(error).to.have.length(1);
    });

    it("renders an error for the description", () => {
      const input = $("#main-content .govuk-textarea--error#description");
      expect(input).to.have.length(1);

      const error = $("#main-content .govuk-error-message#description-error");
      expect(error).to.have.length(1);
    });
  });
});