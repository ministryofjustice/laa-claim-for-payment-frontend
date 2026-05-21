import { ChooseUploadViewModel } from "#src/viewmodels/chooseUploadViewModel.js";
import { expect, config as chaiConfig } from "chai";
import { load, CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/claims/chooseUploadView.njk", () => {
  let $: CheerioAPI;

  describe("without errors", () => {
    beforeEach(async () => {
      $ = await renderView('main/claims/chooseUploadView.njk', {
        csrfToken: "csrf-token",
        vm: new ChooseUploadViewModel(),
      });
    });

    it("renders a Back link", () => {
      const back = $("a.govuk-back-link");

      expect(back).to.have.length(1);
      expect(back.text().trim()).to.equal("common.back");
      expect(back.attr("href")).to.equal("#");
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

    it("renders the radio question", () => {
      const legend = $("legend.govuk-fieldset__legend");

      expect(legend).to.have.length(1);
      expect(legend.text().trim()).to.equal("pages.chooseUpload.title");
    });

    it("renders the radio options", () => {
      const radios = $("input[type='radio'][name='fileUploadChoice']");

      expect(radios).to.have.length(2);
      expect(radios.eq(0).attr("value")).to.equal("all-at-once");
      expect(radios.eq(1).attr("value")).to.equal("associated-to-line-items");
    });

    it("renders the radio labels", () => {
      const labels = $(".govuk-radios__label").map((_, el) => $(el).text().trim()).get();

      expect(labels).to.deep.equal([
        "pages.chooseUpload.allAtOnce.text",
        "pages.chooseUpload.associatedToLineItems.text",
      ]);
    });

    it("renders the radio hints", () => {
      const hints = $(".govuk-hint").map((_, el) => $(el).text().trim()).get();

      expect(hints).to.include.members([
        "pages.chooseUpload.allAtOnce.hint",
        "pages.chooseUpload.associatedToLineItems.hint",
      ]);
    });

    it("renders the continue button", () => {
      const button = $("button.govuk-button");

      expect(button).to.have.length(1);
      expect(button.text().trim()).to.equal("common.saveAndContinue");
    });

    it("does not render an error summary", () => {
      expect($(".govuk-error-summary")).to.have.length(0);
    });
  });

  describe("with errors", () => {
    beforeEach(async () => {
      $ = await renderView('main/claims/chooseUploadView.njk', {
        csrfToken: "csrf-token",
        vm: new ChooseUploadViewModel({
          error: {
            text: "pages.chooseUpload.error.empty",
          },
        }),
      });
    });

    it("renders an error summary", () => {
      const errorSummary = $(".govuk-error-summary");

      expect(errorSummary).to.have.length(1);
      expect(errorSummary.text()).to.contain("common.errorSummaryTitle");
      expect(errorSummary.text()).to.contain("pages.chooseUpload.error.empty");
    });

    it("links the error summary to the radio group", () => {
      const errorLink = $(".govuk-error-summary a");

      expect(errorLink).to.have.length(1);
      expect(errorLink.attr("href")).to.equal("#fileUploadChoice");
    });

    it("renders an inline radio error", () => {
      const errorMessage = $(".govuk-error-message");

      expect(errorMessage).to.have.length(1);
      expect(errorMessage.text()).to.contain("pages.chooseUpload.error.empty");
    });
  });
});