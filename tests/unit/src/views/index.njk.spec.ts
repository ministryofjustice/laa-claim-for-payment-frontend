import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect, config as chaiConfig } from "chai";
import { load, CheerioAPI } from "cheerio";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/index.njk", () => {
  let $: CheerioAPI;

  const viewModel = new ClaimsTableViewModel(getClaimsSuccessResponseData.data);

  const context = {
    head: viewModel.head,
    rows: viewModel.rows
  };

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } = await import("../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/index.njk", context);
    $ = load(html);
  });

  it("renders the status in the main H1", () => {
    const h1 = $("h1.govuk-heading-xl").text().trim();
    expect(h1).to.equal("Your Claims");
  });

  it("renders the create claim buttons", () => {
    const importButton = $(".govuk-button").first().text().trim();
    const createButton = $(".govuk-button--secondary").text().trim();

    expect(importButton).to.equal("Import claim");
    expect(createButton).to.equal("Create a new claim");
  });

  it("renders the sub navigation", () => {
    const subNav = $("Sub navigation");

    expect(subNav).to.exist;
    expect(subNav).to.have.include;
  });

  it("renders the table", () => {
    const table = $(".govuk-table");

    expect(table).to.exist;
  });

  it("renders the headers", () => {
    const headers = $(".govuk-table__header");

    expect(headers.length).to.equal(6);
  });

  it("renders a row for each claim", () => {
    const rows = $(".govuk-table__body > .govuk-table__row");

    expect(rows.length).to.equal(11);
  });
});
