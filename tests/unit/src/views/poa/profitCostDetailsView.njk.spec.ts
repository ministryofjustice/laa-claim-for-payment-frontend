import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { ProfitCostDetailsViewModel } from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import {
  buildProfitCostDetailsForm,
  validateProfitCostDetails,
} from "#src/helpers/profitCostDetailsValidation.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/profitCostDetailsView.njk", () => {
  let $: CheerioAPI;

  describe("without errors", () => {
    const form = buildProfitCostDetailsForm(undefined);

    beforeEach(async () => {
      $ = await renderView("main/poa/profitCostDetailsView.njk", {
        csrfToken: "csrf-token",
        vm: new ProfitCostDetailsViewModel({ form }),
      });
    });

    it("renders a Back link", () => {
      const back = $("a.govuk-back-link");

      expect(back).to.have.length(1);
      expect(back.text().trim()).to.equal("common.back");
      expect(back.attr("href")).to.equal("#");
    });

    it("renders the page title", () => {
      const title = $("h1");

      expect(title).to.have.length(1);
      expect(title.text().trim()).to.equal("pages.profitCostDetails.title");
    });

    it("renders the form", () => {
      const form = $("form");

      expect(form).to.have.length(1);
      expect(form.attr("method")).to.equal("post");
    });

    it("renders the CSRF token", () => {
      const csrf = $("input[name='_csrf']");

      expect(csrf).to.have.length(1);
      expect(csrf.attr("value")).to.equal("csrf-token");
    });

    it("renders the court type radios", () => {
      const radios = $("input[type='radio'][name='courtTypeChoice']");

      expect(radios).to.have.length(4);
    });

    it("renders the court type legend", () => {
      const legend = $("legend").filter((_, el) =>
        $(el).text().includes("pages.profitCostDetails.courtType.title"),
      );

      expect(legend).to.have.length(1);
    });

    it("renders the client status radios", () => {
      const radios = $("input[type='radio'][name='clientStatusChoice']");

      expect(radios).to.have.length(3);
    });

    it("renders the client status legend", () => {
      const legend = $("legend").filter((_, el) =>
        $(el).text().includes("pages.profitCostDetails.clientStatus.title"),
      );

      expect(legend).to.have.length(1);
    });

    it("renders the first solicitor radios", () => {
      const radios = $("input[type='radio'][name='firstSolicitorChoice']");

      expect(radios).to.have.length(2);
    });

    it("renders the first solicitor legend", () => {
      const legend = $("legend").filter((_, el) =>
        $(el).text().includes("pages.profitCostDetails.firstSolicitor.title"),
      );

      expect(legend).to.have.length(1);
    });

    it("renders the transfer of solicitor radios", () => {
      const radios = $("input[type='radio'][name='transferOfSolicitorChoice']");

      expect(radios).to.have.length(2);
    });

    it("renders the transfer of solicitor legend", () => {
      const legend = $("legend").filter((_, el) =>
        $(el)
          .text()
          .includes("pages.profitCostDetails.transferOfSolicitor.title"),
      );

      expect(legend).to.have.length(1);
    });

    it("renders the continue button", () => {
      const button = $("button.govuk-button");

      expect(button).to.have.length(1);
      expect(button.text().trim()).to.equal("common.saveAndContinue");
    });

    it("renders the come back later button", () => {
      const link = $("a.govuk-button--secondary");

      expect(link).to.have.length(1);
      expect(link.text().trim()).to.equal("common.saveAndComeBackLater");
    });

    it("does not render an error summary", () => {
      expect($(".govuk-error-summary")).to.have.length(0);
    });
  });

  describe("with errors", () => {
    const form = validateProfitCostDetails({
      courtTypeChoice: "",
      clientStatusChoice: "",
      firstSolicitorChoice: "",
      transferOfSolicitorChoice: "",
    });

    beforeEach(async () => {
      $ = await renderView("main/poa/profitCostDetailsView.njk", {
        csrfToken: "csrf-token",
        vm: new ProfitCostDetailsViewModel({ form }),
      });
    });

    it("renders an error summary", () => {
      const errorSummary = $(".govuk-error-summary");

      expect(errorSummary).to.have.length(1);
      expect(errorSummary.text()).to.contain("common.errorSummaryTitle");
      expect(errorSummary.text()).to.contain(
        "pages.profitCostDetails.courtType.errors.empty",
      );
      expect(errorSummary.text()).to.contain(
        "pages.profitCostDetails.clientStatus.errors.empty",
      );
      expect(errorSummary.text()).to.contain(
        "pages.profitCostDetails.firstSolicitor.errors.empty",
      );
      expect(errorSummary.text()).to.contain(
        "pages.profitCostDetails.transferOfSolicitor.errors.empty",
      );
    });

    it("links errors to the correct fields", () => {
      const links = $(".govuk-error-summary a");

      expect(links).to.have.length(4);

      expect(links.eq(0).attr("href")).to.equal("#courtTypeChoice");
      expect(links.eq(1).attr("href")).to.equal("#clientStatusChoice");
      expect(links.eq(2).attr("href")).to.equal("#firstSolicitorChoice");
      expect(links.eq(3).attr("href")).to.equal("#transferOfSolicitorChoice");
    });

    it("renders inline error messages for affected fields", () => {
      const errorMessages = $(".govuk-error-message");

      expect(errorMessages).to.have.length(4);

      expect(errorMessages.eq(0).text()).to.contain(
        "pages.profitCostDetails.courtType.errors.empty",
      );

      expect(errorMessages.eq(1).text()).to.contain(
        "pages.profitCostDetails.clientStatus.errors.empty",
      );

      expect(errorMessages.eq(2).text()).to.contain(
        "pages.profitCostDetails.firstSolicitor.errors.empty",
      );

      expect(errorMessages.eq(3).text()).to.contain(
        "pages.profitCostDetails.transferOfSolicitor.errors.empty",
      );
    });
  });
});
