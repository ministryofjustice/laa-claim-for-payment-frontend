import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/checkDetailsView.njk", () => {
  let $: CheerioAPI;

  const claim: Claim = getClaimsSuccessResponseData.body?.data![0]!;

  const viewModel = new CheckDetailsViewModel(claim);

  beforeEach(async () => {
    $ = await renderView("main/poa/checkDetailsView.njk", {
      vm: viewModel,
    });
  });

  it("doesn't render a Back link", () => {
    const back = $("a.govuk-back-link");

    expect(back).to.have.length(0);
  });

  it("renders an h1", () => {
    const h1s = $("#main-content h1");
    expect(h1s).to.have.length(1);
    const h1 = h1s.first();
    expect(h1.text().trim()).to.equal("pages.poa.checkYourDetails.title");
  });

  describe("Assessment summary", () => {
    it("renders the assessment summary table", () => {
      const table = $("table.govuk-table");

      expect(table).to.have.length(1);
      expect(
        table.find("caption.govuk-table__caption").text().trim(),
      ).to.equal("pages.poa.checkYourDetails.assessmentSummary.title");
    });

    it("renders the assessment summary rows", () => {
      const rows = $("table.govuk-table tbody tr");

      expect(rows).to.have.length(4);
    });
  });

  describe("Check your answers", () => {
    it("renders the check your answers heading", () => {
      const heading = $("#main-content h2").first();

      expect(heading.text().trim()).to.equal(
        "pages.poa.checkYourDetails.cya.title",
      );
    });

    it("renders the profit cost details card", () => {
      const card = $("#profit-cost-details");

      expect(card).to.have.length(1);

      expect(
        card.find(".govuk-summary-card__title").text().trim(),
      ).to.equal(
        "pages.poa.checkYourDetails.cya.profitCostDetails.title",
      );

      expect(
        card.find(".govuk-summary-list__row")
      ).to.have.length(7);
    });

    it("renders the profit cost bill line card", () => {
      const card = $("#profit-cost-bill-line");

      expect(card).to.have.length(1);

      expect(
        card.find(".govuk-summary-card__title").text().trim(),
      ).to.equal(
        "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
      );

      expect(
        card.find(".govuk-summary-list__row")
      ).to.have.length(5);
    });

    it("renders the evidence card", () => {
      const card = $("#evidence");

      expect(card).to.have.length(1);

      expect(
        card.find(".govuk-summary-card__title").text().trim(),
      ).to.equal(
        "pages.poa.checkYourDetails.cya.evidence.title",
      );

      expect(
        card.find(".govuk-summary-list__row")
      ).to.have.length(1);
    });




    it("renders the expert cost bill line cards", () => {
      const cards = $("#expert-cost-bill-line");

      expect(cards.length).to.equal(2);

      cards.each((_, el) => {
        const card = $(el);
        expect(
          card.find(".govuk-summary-card__title").first().text().trim()
        ).to.equal(
          "pages.poa.checkYourDetails.cya.expertCostBillLine.title"
        );
        expect(
          card.find(".govuk-summary-list__row").length
        ).to.equal(5);
      });
    });
  });
});