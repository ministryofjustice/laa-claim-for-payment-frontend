import { PaginationMeta } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { getEnValue } from "#tests/support/i18n.js";
import { expect, config as chaiConfig } from "chai";
import { load, CheerioAPI } from "cheerio";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/index.njk", () => {
  let $: CheerioAPI;

  const claims: Claim[] = getClaimsSuccessResponseData.body?.data!;

  const paginationMeta: PaginationMeta = {
    total: 11,
    page: 1,
    limit: 20,
  };

  const viewModel = new ClaimsTableViewModel(claims, paginationMeta, "/foo");

  const context = {
    head: viewModel.head,
    rows: viewModel.rows,
  };

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } = await import("../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/index.njk", context);
    $ = load(html);
  });

  it("renders the H1", () => {
    const h1 = $("h1.govuk-heading-xl").text().trim();
    expect(h1).to.equal("pages.home.title");
    const enValue = getEnValue(h1);
    expect(enValue).to.equal("Your Claims");
    // expect(cyValue).to.equal("eich hawliadau");
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
    const theadHeaders = $("table.govuk-table thead .govuk-table__header");
    expect(theadHeaders.length).to.equal(6);

    const texts = theadHeaders.map((_, el) => $(el).text().trim()).get();
    expect(texts).to.deep.equal([
      "ID",
      "Client",
      "Category",
      "Concluded",
      "Fee Type",
      "Claimed"
    ]);
  });

  it("renders a row for each claim", () => {
    const rows = $(".govuk-table__body > .govuk-table__row");

    expect(rows.length).to.equal(11);
  });

  it("renders the pagination", () => {
    const pagination = $(".moj-pagination");

    expect(pagination).to.exist;
  });
});
