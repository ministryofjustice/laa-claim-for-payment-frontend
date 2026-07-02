import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { ProfitCostBillLineViewModel } from "#src/viewmodels/poa/profitCostBillLineViewModel.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/profitCostBillLineView.njk", () => {
  let $: CheerioAPI;

  beforeEach(async () => {
    $ = await renderView("main/poa/profitCostBillLineView.njk", {
      csrfToken: "test-csrf-token",
      vm: new ProfitCostBillLineViewModel({
        claimId: 1,
      }),
    });
  });

  it("renders a Back link", () => {
    const back = $("a.govuk-back-link");

    expect(back).to.have.length(1);
    expect(back.text().trim()).to.equal("common.back");
  });

  it("renders an h1", () => {
    const h1 = $("#main-content h1");

    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("pages.profitCostBillLine.title");
  });

  it("renders the activity date section", () => {
    const fieldset = $("fieldset").first();

    expect(fieldset.find("legend").text().trim()).to.equal(
      "pages.profitCostBillLine.activityDate.title",
    );

    expect(fieldset.find(".govuk-hint").text().trim()).to.equal(
      "pages.profitCostBillLine.activityDate.hint",
    );

    expect($("input[name='activityDateDay']")).to.have.length(1);
    expect($("input[name='activityDateMonth']")).to.have.length(1);
    expect($("input[name='activityDateYear']")).to.have.length(1);
  });

  it("renders the profit cost input with pound prefix", () => {
    const input = $("input[name='actualNetProfitCostExcludingAdvocacy']");

    expect(input).to.have.length(1);
    expect(input.attr("inputmode")).to.equal("decimal");
    expect(input.hasClass("govuk-input--width-5")).to.equal(true);

    const formGroup = input.closest(".govuk-form-group");

    expect(formGroup.find("label").text().trim()).to.equal(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.title",
    );

    expect(formGroup.find(".govuk-input__prefix").text().trim()).to.equal("£");
  });

  it("renders the advocacy costs input with pound prefix", () => {
    const input = $("input[name='actualNetAdvocacyCosts']");

    expect(input).to.have.length(1);
    expect(input.attr("inputmode")).to.equal("decimal");
    expect(input.hasClass("govuk-input--width-5")).to.equal(true);

    const formGroup = input.closest(".govuk-form-group");

    expect(formGroup.find("label").text().trim()).to.equal(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.title",
    );

    expect(formGroup.find(".govuk-input__prefix").text().trim()).to.equal("£");
  });

  it("renders VAT radio buttons", () => {
    const radios = $("input[name='vatApplies']");

    expect(radios).to.have.length(2);
    expect(radios.eq(0).attr("value")).to.equal("yes");
    expect(radios.eq(1).attr("value")).to.equal("no");

    const fieldset = radios.first().closest("fieldset");

    expect(fieldset.find("legend").text().trim()).to.equal(
      "pages.profitCostBillLine.vatApplies.title",
    );
  });

  it("renders fee earner name input", () => {
    const input = $("input[name='feeEarnerName']");

    expect(input).to.have.length(1);

    const formGroup = input.closest(".govuk-form-group");

    expect(formGroup.find("label").text().trim()).to.equal(
      "pages.profitCostBillLine.feeEarnerName.title",
    );
  });

  it("renders save and continue button", () => {
    const button = $("button.govuk-button").first();

    expect(button.text().trim()).to.equal("common.saveAndContinue");
  });

  it("renders save and come back later link", () => {
    const link = $("a.govuk-button--secondary");

    expect(link).to.have.length(1);
    expect(link.text().trim()).to.equal("common.saveAndComeBackLater");
  });

  it("does not render an error summary when there are no errors", () => {
    expect($(".govuk-error-summary")).to.have.length(0);
  });
});

describe("views/main/poa/profitCostBillLineView.njk with errors", () => {
  let $: CheerioAPI;

  beforeEach(async () => {
    $ = await renderView("main/poa/profitCostBillLineView.njk", {
      csrfToken: "test-csrf-token",
      vm: new ProfitCostBillLineViewModel({
        claimId: 1,
        form: {
          activityDateDay: "",
          activityDateMonth: "",
          activityDateYear: "",
          actualNetProfitCostExcludingAdvocacy: "",
          actualNetAdvocacyCosts: "",
          vatApplies: "",
          feeEarnerName: "",
        },
        errors: [
          {
            fieldName: "activityDate",
            href: "#activityDate-day",
            text: {
              key: "pages.profitCostBillLine.activityDate.errors.empty"
            },
          },
          {
            fieldName: "actualNetProfitCostExcludingAdvocacy",
            href: "#actualNetProfitCostExcludingAdvocacy",
            text: {
              key: "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.empty"
            },
          },
          {
            fieldName: "actualNetAdvocacyCosts",
            href: "#actualNetAdvocacyCosts",
            text: {
              key: "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.empty"
            },
          },
          {
            fieldName: "vatApplies",
            href: "#vatApplies",
            text: {
              key: "pages.profitCostBillLine.vatApplies.errors.empty"
            },
          },
          {
            fieldName: "feeEarnerName",
            href: "#feeEarnerName",
            text: {
              key: "pages.profitCostBillLine.feeEarnerName.errors.empty"
            },
          },
        ],
      }),
    });
  });

  it("renders an error summary", () => {
    const errorSummary = $(".govuk-error-summary");

    expect(errorSummary).to.have.length(1);
    expect(errorSummary.find("h2").text().trim()).to.equal(
      "common.errorSummaryTitle",
    );

    const links = errorSummary.find("a");

    expect(links).to.have.length(5);
    expect(links.eq(0).text().trim()).to.equal(
      "pages.profitCostBillLine.activityDate.errors.empty",
    );
    expect(links.eq(0).attr("href")).to.equal("#activityDate-day");
  });

  it("renders field level errors", () => {
    const errors = $(".govuk-error-message");

    expect(errors).to.have.length(5);

    expect(errors.eq(0).text()).to.contain(
      "pages.profitCostBillLine.activityDate.errors.empty",
    );

    expect(errors.eq(1).text()).to.contain(
      "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors.empty",
    );

    expect(errors.eq(2).text()).to.contain(
      "pages.profitCostBillLine.actualNetAdvocacyCosts.errors.empty",
    );

    expect(errors.eq(3).text()).to.contain(
      "pages.profitCostBillLine.vatApplies.errors.empty",
    );

    expect(errors.eq(4).text()).to.contain(
      "pages.profitCostBillLine.feeEarnerName.errors.empty",
    );
  });

  it("preserves submitted values", async () => {
    $ = await renderView("main/poa/profitCostBillLineView.njk", {
      csrfToken: "test-csrf-token",
      vm: new ProfitCostBillLineViewModel({
        claimId: 1,
        form: {
          activityDateDay: "27",
          activityDateMonth: "3",
          activityDateYear: "2007",
          actualNetProfitCostExcludingAdvocacy: "123.45",
          actualNetAdvocacyCosts: "156.00",
          vatApplies: "yes",
          feeEarnerName: "John Smith",
        },
      }),
    });

    expect($("input[name='activityDateDay']").attr("value")).to.equal("27");
    expect($("input[name='activityDateMonth']").attr("value")).to.equal("3");
    expect($("input[name='activityDateYear']").attr("value")).to.equal("2007");
    expect(
      $("input[name='actualNetProfitCostExcludingAdvocacy']").attr("value"),
    ).to.equal("123.45");
    expect($("input[name='actualNetAdvocacyCosts']").attr("value")).to.equal(
      "156.00",
    );
    expect($("input[name='vatApplies'][value='yes']").attr("checked")).to.equal(
      "checked",
    );
    expect($("input[name='feeEarnerName']").attr("value")).to.equal(
      "John Smith",
    );
  });
});