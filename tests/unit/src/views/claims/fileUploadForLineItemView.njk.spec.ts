import { config as chaiConfig, expect } from "chai";
import { CheerioAPI, load } from "cheerio";
import { Claim, LineItem } from "#src/types/Claim.js";
import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

//TODO: Turn this into a test asset instead of duplicating
const claim: Claim = {
  id: 1,
  concluded: new Date(),
  ufn: "someUFN",
  providerUserId: "someProviderUserId",
  client: "someClient",
  category: "someCategory",
  feeType: "someFeeType",
  claimed: 1,
  submissionId: "someSubmissionId",
  lineItems: [],
};

const lineItem: LineItem = {
    id: 1,
    title: "Bill Narrative",
};

describe("views/main/claims/fileUploadForLineItemView.njk", () => {
  let $: CheerioAPI;

  const viewModel = new FileUploadForLineItemViewModel(claim, lineItem);

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } =
      await import("../../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/claims/fileUploadForLineItemView.njk", {
      vm: viewModel,
    });
    $ = load(html);
  });

  it("renders the title in the main H1", () => {
    const h1 = $("h1.govuk-heading-xl");
    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("Bill Narrative");
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
      "pages.fileUploadForLineItem.p1"
    );
  });

  it("renders list items within upload evidence explanation", () => {
    const lis = $("#main-content ul li");
    expect(lis).to.have.length(5);
    expect(lis.eq(0).text().trim()).to.equal("pages.fileUploadForLineItem.ul1");
    expect(lis.eq(1).text().trim()).to.equal("pages.fileUploadForLineItem.ul2");
    expect(lis.eq(2).text().trim()).to.equal("pages.fileUploadForLineItem.examplesOfEvidence.courtOrders");
    expect(lis.eq(3).text().trim()).to.equal("pages.fileUploadForLineItem.examplesOfEvidence.invoices");
    expect(lis.eq(4).text().trim()).to.equal("pages.fileUploadForLineItem.examplesOfEvidence.attendanceNotes");
  });

  it("renders the 'examples of evidence' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(1);
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal(
      "pages.fileUploadForLineItem.examplesOfEvidence.examples",
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

  it("renders the 'max size' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(2);
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal(
      "pages.fileUploadForLineItem.uploadFiles.maxSize",
    );
  });

  it("renders a 'Save and continue' button", () => {
    const buttons = $(".govuk-button-group .govuk-button");
    const button = buttons.first();
    expect(button.text().trim()).to.equal("common.saveAndContinue");
    expect(button.attr("href")).to.equal("/claims/1/upload-evidence-individually");
  });

  it("renders a 'Save and come back later' button", () => {
    const buttons = $(".govuk-button-group .govuk-button");
    const button = buttons.eq(1);
    expect(button.hasClass("govuk-button--secondary")).to.equal(true);
    expect(button.text().trim()).to.equal("common.saveAndComeBackLater");
    expect(button.attr("href")).to.equal("/claims/1/upload-evidence-individually");
  });
});
