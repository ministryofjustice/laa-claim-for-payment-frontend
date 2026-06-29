import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/poaEvidenceUploadView.njk", () => {
  let $: CheerioAPI;

  const viewModel = new PoaEvidenceUploadViewModel({
    uploadUrl: "/upload",
    deleteUrl: "/delete",
    saveAndContinueHref: "/continue",
    saveAndComeBackLaterHref: "#",
  });

  beforeEach(async () => {
    $ = await renderView("main/poa/poaEvidenceUploadView.njk", {
      vm: viewModel,
      csrfToken: "test-csrf-token",
    });
  });

  it("renders a Back link", () => {
    const a = $("a.govuk-back-link");

    expect(a).to.have.length(1);
    expect(a.attr("href")).to.equal("#");
  });

  it("renders the title in the main H1", () => {
    const h1 = $("h1.govuk-heading-xl");

    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("pages.poaEvidenceUpload.title");
  });

  it("renders the evidence examples paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.first();

    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal("pages.poaEvidenceUpload.examples");
  });

  it("renders the Naming files section", () => {
    const h2s = $("#main-content h2");

    expect(h2s.first().text().trim()).to.equal(
      "pages.poaEvidenceUpload.namingFiles.title",
    );

    const ps = $("#main-content p");

    expect(ps.eq(1).text().trim()).to.equal(
      "pages.poaEvidenceUpload.namingFiles.p1",
    );

    expect(ps.eq(2).text().trim()).to.equal(
      "pages.poaEvidenceUpload.namingFiles.p2",
    );
  });

  it("renders the Upload files section", () => {
    const h2s = $("#main-content h2");

    expect(h2s.eq(1).text().trim()).to.equal(
      "pages.poaEvidenceUpload.uploadFiles.title",
    );

    const ps = $("#main-content p");

    expect(ps.eq(3).text().trim()).to.equal(
      "pages.poaEvidenceUpload.uploadFiles.maxSize",
    );
  });

  it("renders the multi-file upload config", () => {
    const config = $("#multi-file-upload-config");

    expect(config).to.have.length(1);
    expect(config.attr("data-upload-url")).to.equal("/upload");
    expect(config.attr("data-delete-url")).to.equal("/delete");
  });

  it("renders the multi-file upload component", () => {
    expect($(".moj-multi-file-upload")).to.have.length(1);
    expect($(".moj-multi-file-upload__input").attr("name")).to.equal(
      "documents",
    );
  });

  it("does not render uploaded files initially", () => {
    const elements = $("#main-content .moj-multi-file__uploaded-files");
    const element = elements.eq(0);

    expect(element.hasClass("moj-hidden")).to.equal(true);
  });

  it("renders the upload button", () => {
    const uploadButton = $(".moj-multi-file-upload__button");

    expect(uploadButton).to.have.length(1);
    expect(uploadButton.text().trim()).to.equal(
      "pages.poaEvidenceUpload.uploadFiles.uploadButton",
    );
  });

  it("renders a Save and continue button", () => {
    const buttons = $(".govuk-button-group .govuk-button");
    const button = buttons.first();

    expect(button.text().trim()).to.equal("common.saveAndContinue");
  });

  it("renders a Save and come back later button", () => {
    const button = $(".govuk-button-group .govuk-button--secondary");

    expect(button).to.have.length(1);
    expect(button.text().trim()).to.equal("common.saveAndComeBackLater");
    expect(button.attr("href")).to.equal("#");
  });

  it("renders the CSRF token", () => {
    const csrf = $("input[name='_csrf']");

    expect(csrf).to.have.length(1);
    expect(csrf.attr("value")).to.equal("test-csrf-token");
  });
});