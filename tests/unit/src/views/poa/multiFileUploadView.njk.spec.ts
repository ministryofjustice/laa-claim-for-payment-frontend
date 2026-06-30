import { config as chaiConfig, expect } from "chai";
import { CheerioAPI, load } from "cheerio";
import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import { claim1, claim2, claim3 } from "#tests/assets/claim.js";
import { billNarrativeLineItem, workItemLineItem1 } from "#tests/assets/lineItems.js";
import { renderView } from "#tests/unit/src/views/base/renderView.js";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/poa/multiFileUploadView.njk", () => {
  let $: CheerioAPI;

  describe("with no reusable documents", () => {
    const viewModel = new FileUploadForLineItemViewModel(
      claim1,
      billNarrativeLineItem, "/upload", "/delete", "/continue"
    );

    beforeEach(async () => {
      $ = await renderView('main/poa/multiFileUploadView.njk', {
        vm: viewModel,
        csrfToken: "test-csrf-token",
        uploadedFile: [],
      });
    });

    it("renders the title in the main H1", () => {
      const h1 = $("h1.govuk-heading-xl");

      expect(h1).to.have.length(1);
      expect(h1.text().trim()).to.equal("pages.poa.multiFileUpload.title");
    });

    it("renders a 'Back' link", () => {
      const a = $("a.govuk-back-link");

      expect(a).to.have.length(1);
      expect(a.attr("href")).to.equal("#");
    });

    it("renders the 'examples' paragraph", () => {
      const ps = $("#main-content p");
      const p = ps.first();

      expect(p).to.have.length(1);
      expect(p.text().trim()).to.equal(
        "pages.poa.multiFileUpload.p1",
      );
    });

    it("renders the 'naming' paragraph", () => {
      const ps = $("#main-content p");
      const p = ps.eq(1);

      expect(p).to.have.length(1);

      expect(p.text().trim()).to.equal(
        "pages.poa.multiFileUpload.naming",
      );
    });

    it("renders the 'Upload Files' title", () => {
      const h2s = $("#main-content h2");
      const h2 = h2s.eq(1);

      expect(h2).to.have.length(1);

      expect(h2.text().trim()).to.equal(
        "pages.fileUploadForLineItem.uploadFiles.title",
      );
    });

    it("renders the 'examples' paragraph", () => {
      const ps = $("#main-content p");
      const p = ps.eq(2);

      expect(p).to.have.length(1);

      expect(p.text().trim()).to.equal(
        "pages.poa.multiFileUpload.examples",
      );
    });

    it("renders the 'max size' paragraph", () => {
      const ps = $("#main-content p");
      const p = ps.eq(3);

      expect(p).to.have.length(1);

      expect(p.text().trim()).to.equal(
        "pages.fileUploadForLineItem.uploadFiles.maxSize",
      );
    });

    it("renders the multi-file upload config", () => {
      const config = $("#multi-file-upload-config");

      expect(config).to.have.length(1);

      expect(config.attr("data-upload-url")).to.equal(
        "/upload",
      );

      expect(config.attr("data-delete-url")).to.equal(
        "/delete",
      );
    });

    it("renders the multi-file upload component", () => {
      expect($(".moj-multi-file-upload")).to.have.length(1);

      expect(
        $(".moj-multi-file-upload__input").attr("name"),
      ).to.equal("documents");
    });

    it("does not render uploaded files heading initially", () => {
      expect($("#uploaded-files-heading")).to.have.length(0);
    });

    it("renders a 'Save and continue' button", () => {
      const buttons = $(".govuk-button-group .govuk-button");
      const button = buttons.first();

      expect(button.text().trim()).to.equal(
        "common.saveAndContinue",
      );

      expect(button.attr("href")).to.equal(
        "/continue",
      );
    });

    it("renders a 'Save and come back later' button", () => {
      const buttons = $(".govuk-button-group .govuk-button");
      const button = buttons.eq(1);

      expect(
        button.hasClass("govuk-button--secondary"),
      ).to.equal(true);

      expect(button.text().trim()).to.equal(
        "common.saveAndComeBackLater",
      );

      expect(button.attr("href")).to.equal(
        "/continue",
      );
    });

    it("renders the CSRF token", () => {
      const csrf = $("input[name='_csrf']");

      expect(csrf).to.have.length(1);
      expect(csrf.attr("value")).to.equal("test-csrf-token");
    });
  });

  describe("with reusable documents", () => {
    let $: CheerioAPI;

    const viewModel = new FileUploadForLineItemViewModel(claim1, workItemLineItem1, "/upload", "/delete", "/continue");

    beforeEach(async () => {
      $ = await renderView('main/poa/multiFileUploadView.njk', {
        vm: viewModel,
        uploadedFile: [],
        csrfToken: "test-csrf-token",
      });
    });

    it("renders the 'Reuse a document' h2", () => {
      const h2s = $("#main-content h2");
      const h2 = h2s.eq(1);
      expect(h2).to.have.length(1);
      expect(h2.text().trim()).to.equal(
        "pages.fileUploadForLineItem.reuseADocument.title",
      );
    });

    it("renders the CSRF token", () => {
      const csrf = $("input[name='_csrf']");

      expect(csrf).to.have.length(1);
      expect(csrf.attr("value")).to.equal("test-csrf-token");
    });
  });

  describe("with no uploaded files", () => {
    let $: CheerioAPI;

    const viewModel = new FileUploadForLineItemViewModel(
      claim3,
      workItemLineItem1, "/upload", "/delete", "/continue"
    );

    beforeEach(async () => {
      $ = await renderView('main/poa/multiFileUploadView.njk', {
        vm: viewModel,
        uploadedFile: [],
        csrfToken: "test-csrf-token",
      });
    });

    it("renders a hidden container for the uploaded files", () => {
      const elements = $("#main-content .moj-multi-file__uploaded-files");
      const element = elements.eq(0);
      expect(element.hasClass("moj-hidden")).to.be.true;
    });

    it("renders an empty summary list", () => {
      const elements = $("#main-content .moj-multi-file-upload__list");
      const element = elements.eq(0);
      const rows = element.find(".moj-multi-file-upload__row");
      expect(rows.length).to.equal(0);
    });
  });

  describe("with uploaded files", () => {
    let $: CheerioAPI;

    const viewModel = new FileUploadForLineItemViewModel(
      claim2,
      billNarrativeLineItem, "/upload", "/delete", "/continue"
    );

    beforeEach(async () => {
      $ = await renderView('main/poa/multiFileUploadView.njk', {
        vm: viewModel,
        uploadedFile: [],
        csrfToken: "test-csrf-token",
      });
    });

    it("renders a container for the uploaded files", () => {
      const elements = $("#main-content .moj-multi-file__uploaded-files");
      const element = elements.eq(0);
      expect(element.hasClass("moj-hidden")).to.be.false;
    });

    it("renders a summary list with one row", () => {
      const elements = $("#main-content .moj-multi-file-upload__list");
      const element = elements.eq(0);
      const rows = element.find(".moj-multi-file-upload__row");
      expect(rows.length).to.equal(1);
    });
  });
});