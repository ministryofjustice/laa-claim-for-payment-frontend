import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { ClaimDto } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";
import { claim10, claim9 } from "#tests/assets/claim.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/checkDetailsView.njk", () => {
  let $: CheerioAPI;

  const claim: ClaimDto = getClaimsSuccessResponseData.body?.data![0]!;

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
      expect(table.find("caption.govuk-table__caption").text().trim()).to.equal(
        "pages.poa.checkYourDetails.assessmentSummary.title",
      );
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

    describe("with profit cost bill line item", () => {
      const viewModel = new CheckDetailsViewModel(claim9);

      beforeEach(async () => {
        $ = await renderView("main/poa/checkDetailsView.njk", {
          vm: viewModel,
        });
      });

      it("renders the profit cost details card", () => {
        const card = $("#profit-cost-details");

        expect(card).to.have.length(1);

        expect(card.find(".govuk-summary-card__title").text().trim()).to.equal(
          "pages.poa.checkYourDetails.cya.profitCostDetails.title",
        );

        expect(card.find(".govuk-summary-list__row")).to.have.length(8);
      });

      it("renders the profit cost bill line card", () => {
        const card = $("#profit-cost-bill-line");

        expect(card).to.have.length(1);

        expect(card.find(".govuk-summary-card__title").text().trim()).to.equal(
          "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
        );

        expect(card.find(".govuk-summary-list__row")).to.have.length(5);
      });
    });

    describe("with expert cost line items", () => {
      const viewModel = new CheckDetailsViewModel(claim10);

      beforeEach(async () => {
        $ = await renderView("main/poa/checkDetailsView.njk", {
          vm: viewModel,
        });
      });

      it("renders the expert cost bill line cards", () => {
        const cards = $('[id^="expert-cost-bill-line-"]').filter((_, el) =>
          /^expert-cost-bill-line-\d+$/.test($(el).attr("id") ?? "")
        );

        expect(cards.length).to.equal(2);

        cards.each((index, el) => {
          const card = $(el);
          expect(card.attr("id")).to.equal(`expert-cost-bill-line-${index + 1}`);
          expect(
            card.find(".govuk-summary-card__title").first().text().trim(),
          ).to.equal("pages.poa.checkYourDetails.cya.expertCostBillLine.title");
          expect(card.find(".govuk-summary-list__row").length).to.equal(5);
        });
      });
    });

    describe("with evidence", () => {
      it("renders the evidence card", () => {
        const card = $("#evidence");

        expect(card).to.have.length(1);

        expect(card.find(".govuk-summary-card__title").text().trim()).to.equal(
          "pages.poa.checkYourDetails.cya.evidence.title",
        );

        expect(card.find(".govuk-summary-list__row")).to.have.length(1);
      });
    });

    describe("without evidence", () => {
      const claim: ClaimDto = getClaimsSuccessResponseData.body?.data![2]!;

      const viewModel = new CheckDetailsViewModel(claim);

      beforeEach(async () => {
        $ = await renderView("main/poa/checkDetailsView.njk", {
          vm: viewModel,
        });
      });

      it("doesn't render the evidence card", () => {
        const card = $("#evidence");

        expect(card).to.have.length(0);
      });
    });
  });
});
