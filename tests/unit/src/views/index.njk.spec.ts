import { PaginationMeta } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { getEnValue } from "#tests/support/i18n.js";
import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/index.njk", () => {
  let $: CheerioAPI;

  const claims: Claim[] = getClaimsSuccessResponseData.body?.data!;

  const paginationMeta: PaginationMeta = {
    total: 11,
    page: 0,
    limit: 20,
  };

  const viewModel = new ClaimsTableViewModel(claims, paginationMeta, "/foo");

  const context = {
    table: viewModel.table,
  };

  beforeEach(async () => {
    $ = await renderView("main/index.njk", context);
  });

  it("renders the H1", () => {
    const h1 = $("h1.govuk-heading-xl").text().trim();
    expect(h1).to.equal("pages.home.title");
    const enValue = getEnValue(h1);
    expect(enValue).to.equal("Your Claims");
    // expect(cyValue).to.equal("eich hawliadau");
  });

  it("renders the action buttons", () => {
    const importButton = $(".govuk-button").first();
    const createButton = $(".govuk-button--secondary").eq(0);
    const poaButton = $(".govuk-button--secondary").eq(1);

    expect(importButton.text().trim()).to.equal("pages.home.actions.import");
    expect(importButton.attr("name")).to.equal("action");
    expect(importButton.attr("value")).to.equal("import");

    expect(createButton.text().trim()).to.equal("pages.home.actions.create");
    expect(createButton.attr("name")).to.equal("action");
    expect(createButton.attr("value")).to.equal("create");

    expect(poaButton.text().trim()).to.equal("pages.home.actions.poa");
    expect(poaButton.attr("name")).to.equal("action");
    expect(poaButton.attr("value")).to.equal("poa");
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
      "Claimed",
    ]);
  });

  it("renders a row for each claim", () => {
    const rows = $(".govuk-table__body > .govuk-table__row");

    expect(rows.length).to.equal(4);
  });

  it("renders the pagination", () => {
    const pagination = $(".moj-pagination");

    expect(pagination).to.exist;
  });
});
