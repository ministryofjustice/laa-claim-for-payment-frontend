import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { CheerioAPI, load } from "cheerio";
import { PoaClaimTypeViewModel } from "#src/viewmodels/poa/poatClaimTypeViewModel.js";

describe("views/main/poa/poaClaimTypeView.njk", () => {
  let $: CheerioAPI;

  beforeEach(async () => {
    const { setupNunjucksForGovUk } =
      await import("../../../../support/nunjucks-govuk.js");

    const env = setupNunjucksForGovUk();

    const html = env.render("main/poa/poaClaimTypeView.njk", {
      vm: new PoaClaimTypeViewModel(1),
    });

    $ = load(html);
  });

  it("renders the heading", () => {
    const h1 = $("h1.govuk-heading-xl");

    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("pages.poaClaimType.title");
  });

  it("renders the Profit cost radio button", () => {
    const radio = $("input[type='radio'][value='profit-cost']");

    expect(radio).to.have.length(1);
    expect($("label[for='claimType']").text().trim()).to.equal(
      "pages.poaClaimType.profitCost",
    );
  });

  it("renders the Expert cost radio button", () => {
    const radio = $("input[type='radio'][value='expert-cost']");

    expect(radio).to.have.length(1);
    expect($("label[for='claimType-2']").text().trim()).to.equal(
      "pages.poaClaimType.expertCost",
    );
  });

  it("renders the Non expert disbursement radio button", () => {
    const radio = $("input[type='radio'][value='non-expert-disbursement']");

    expect(radio).to.have.length(1);
    expect($("label[for='claimType-3']").text().trim()).to.equal(
      "pages.poaClaimType.nonExpertDisbursement",
    );
  });

  it("renders a Save and continue button", () => {
    const button = $("button.govuk-button").first();

    expect(button.text().trim()).to.equal("common.saveAndContinue");
  });

  it("renders a Save and come back later link", () => {
    const link = $(".govuk-button-group a.govuk-button--secondary");

    expect(link).to.have.length(1);
    expect(link.text().trim()).to.equal("common.saveAndComeBackLater");
    expect(link.attr("href")).to.equal("/claims/1");
  });
});