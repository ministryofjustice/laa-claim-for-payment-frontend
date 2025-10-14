import { Claim } from "#src/types/Claim.js";
import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect, config as chaiConfig } from "chai";
import { load, CheerioAPI } from "cheerio";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/claims/view.njk", () => {
  let $: CheerioAPI;

  const claim: Claim = getClaimsSuccessResponseData.body?.data![0]!;

  const viewModel = new ClaimViewModel(claim);

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } = await import("../../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/claims/view.njk", { vm: viewModel });
    $ = load(html);
  });

    it("renders the title in the main H1", () => {
      const h1 = $("h1.govuk-heading-xl");
      expect(h1).to.have.length(1);
      expect(h1.text().trim()).to.equal(viewModel.title);
    });

    it("renders a Back link to the list", () => {
      const back = $("a.govuk-back-link");
      expect(back).to.have.length(1);
      expect(back.attr("href")).to.equal(viewModel.backLink ?? "/claims");
    });

    it("renders a GOV.UK summary list", () => {
      const sl = $(".govuk-summary-list");
      expect(sl).to.have.length(1);
    });

    it("shows expected summary rows (keys)", () => {
      const keys = $(".govuk-summary-list__key").map((_, el) => $(el).text().trim()).get();
      expect(keys).to.include.members(["Claim ID", "Client", "Category", "Concluded", "Fee type", "Claimed"]);
    });

    it("shows Claim ID value", () => {
      const row = $(".govuk-summary-list__row").filter((_, r) =>
          $(r).find(".govuk-summary-list__key").text().trim() === "Claim ID"
      ).first();
      expect(row.find(".govuk-summary-list__value").text().trim()).to.equal(String(claim.id));
    });

    it("Edit button links to edit page", () => {
      const edit = $(".govuk-button-group .govuk-button").first();
      expect(edit.text().trim()).to.match(/^Amend claim$/);
      expect(edit.attr("href")).to.equal(`/claim/${encodeURIComponent(String(claim.id))}/amend`);
    });

    it("Secondary button links back to claims", () => {
      const btns = $(".govuk-button-group .govuk-button");
      const secondary = btns.eq(1);
      expect(secondary.hasClass("govuk-button--secondary")).to.equal(true);
      expect(secondary.attr("href")).to.equal("/");
    });
});
