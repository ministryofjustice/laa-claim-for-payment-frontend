import { config as chaiConfig, expect } from "chai";
import { CheerioAPI, load } from "cheerio";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claim5 } from "#tests/assets/claim.js";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;


describe("views/main/claims/uploadEvidenceIndividually.njk", () => {
  let $: CheerioAPI;

  const viewModel = new UploadEvidenceIndividuallyViewModel(claim5);

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } =
      await import("../../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/claims/uploadEvidenceIndividually.njk", {
      vm: viewModel,
    });
    $ = load(html);
  });

  it("renders the title in the main H1", () => {
    const h1 = $("h1.govuk-heading-xl");
    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("pages.uploadEvidenceIndividually.title");
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
      "pages.uploadEvidenceIndividually.examples",
    );
  });

  it("renders the 'reusing documents' h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.first();
    expect(h2).to.have.length(1);
    expect(h2.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.reusingDocuments.h2",
    );
  });

  it("renders the 'reusing documents' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(1);
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.reusingDocuments.p",
    );
  });

  it("renders the 'naming files' h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.eq(1);
    expect(h2).to.have.length(1);
    expect(h2.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.namingFiles.h2",
    );
  });

  it("renders the 'naming files' first paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(2);
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.namingFiles.p1",
    );
  });

  it("renders the 'naming files' second paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(3);
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.namingFiles.p2",
    );
  });

  it("renders the 'bill narrative' h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.eq(2);
    expect(h2).to.have.length(1);
    expect(h2.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.billNarrative.h2",
    );
  });

  it("renders the 'bill narrative' task list", () => {
    const taskList = $(".govuk-task-list#bill-narrative");
    expect(taskList).to.have.length(1);
    const tasks = taskList.find(".govuk-task-list__item");
    expect(tasks).to.have.length(1);
  });

  it("renders the 'work items' h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.eq(3);
    expect(h2).to.have.length(1);
    expect(h2.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.workItems.h2",
    );
  });

  it("renders the 'work items' task list", () => {
    const taskList = $(".govuk-task-list#work-items");
    expect(taskList).to.have.length(1);
    const tasks = taskList.find(".govuk-task-list__item");
    expect(tasks).to.have.length(1);
  });

  it("renders the 'disbursements' h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.eq(4);
    expect(h2).to.have.length(1);
    expect(h2.text().trim()).to.equal(
      "pages.uploadEvidenceIndividually.disbursements.h2",
    );
  });

  it("renders the 'disbursements' task list", () => {
    const taskList = $(".govuk-task-list#disbursements");
    expect(taskList).to.have.length(1);
    const tasks = taskList.find(".govuk-task-list__item");
    expect(tasks).to.have.length(1);
  });

  it("renders a 'Save and continue' button", () => {
    const buttons = $(".govuk-button-group .govuk-button");
    const button = buttons.first();
    expect(button.text().trim()).to.equal("common.saveAndContinue");
    expect(button.attr("href")).to.equal("#");
  });

  it("renders a 'Save and come back later' button", () => {
    const buttons = $(".govuk-button-group .govuk-button");
    const button = buttons.eq(1);
    expect(button.hasClass("govuk-button--secondary")).to.equal(true);
    expect(button.text().trim()).to.equal("common.saveAndComeBackLater");
    expect(button.attr("href")).to.equal("#");
  });
});
