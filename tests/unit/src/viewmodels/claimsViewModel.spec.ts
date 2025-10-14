/**
 * @description Tests for the claims table view model
 */

import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect } from "chai";
import { PaginationMeta } from "#src/types/api-types.js";
import { load } from "cheerio";

describe("constructor()", () => {
  it("creates a series of headers", () => {
    const claims: Claim[] = getClaimsSuccessResponseData.body?.data!;

    const paginationMeta: PaginationMeta = {
      total: 11,
      page: 1,
      limit: 20,
    };

    const viewModel = new ClaimsTableViewModel(claims, paginationMeta, "/foo");

    expect(viewModel.head[0].text).to.equal("ID");
    expect(viewModel.head[0].attributes["aria-sort"]).to.equal("ascending");
    expect(viewModel.head[0].classes).to.equal(undefined);

    expect(viewModel.head[1].text).to.equal("Client");
    expect(viewModel.head[1].attributes["aria-sort"]).to.equal("none");
    expect(viewModel.head[1].classes).to.equal(undefined);

    expect(viewModel.head[2].text).to.equal("Category");
    expect(viewModel.head[2].attributes["aria-sort"]).to.equal("none");
    expect(viewModel.head[2].classes).to.equal(undefined);

    expect(viewModel.head[3].text).to.equal("Concluded");
    expect(viewModel.head[3].attributes["aria-sort"]).to.equal("none");
    expect(viewModel.head[3].classes).to.equal(undefined);

    expect(viewModel.head[4].text).to.equal("Fee Type");
    expect(viewModel.head[4].attributes["aria-sort"]).to.equal("none");
    expect(viewModel.head[4].classes).to.equal(undefined);

    expect(viewModel.head[5].text).to.equal("Claimed");
    expect(viewModel.head[5].attributes["aria-sort"]).to.equal("none");
    expect(viewModel.head[5].classes).to.equal("govuk-table__header--numeric");
  });

  it("creates a series of rows", () => {
    const claims: Claim[] = [
      {
        id: 1,
        client: "Giordano",
        category: "Family",
        concluded: new Date("2025-03-18"),
        feeType: "Escape",
        claimed: 234.56,
        submissionId: "550e8400-e29b-41d4-a716-446655440000",
      },
      {
        id: 2,
        client: undefined,
        category: undefined,
        concluded: undefined,
        feeType: undefined,
        claimed: undefined,
        submissionId: undefined,
      },
    ];

    const paginationMeta: PaginationMeta = {
      total: 2,
      page: 1,
      limit: 20,
    };

    const viewModel = new ClaimsTableViewModel(claims, paginationMeta, "/foo");

    // First row
    const firstRow = viewModel.rows[0]
    expect(firstRow[0]).to.have.property("html").that.is.a("string");
    const $a = load(firstRow[0].html as string)("a.govuk-link");
    expect($a).to.have.length(1);
    expect($a.attr("href")).to.equal(`/claims/${encodeURIComponent(String(claims[0].id))}`);
    expect($a.clone().find(".govuk-visually-hidden").remove().end().text().trim()).to.equal("LAA-001");
    expect(firstRow[0].attributes).to.deep.equal({ 'data-sort-value': 1 });
    expect(firstRow[0].classes).to.deep.equal(undefined);

    expect(firstRow[1].text).to.equal("Giordano");
    expect(firstRow[1].attributes).to.equal(undefined);
    expect(firstRow[1].classes).to.equal(undefined);

    expect(firstRow[2].text).to.equal("Family");
    expect(firstRow[2].attributes).to.equal(undefined);
    expect(firstRow[2].classes).to.equal(undefined);

    expect(firstRow[3].text).to.equal("18/03/2025");
    expect(firstRow[3].attributes).to.deep.equal({ "data-sort-value": 1742256000000 });
    expect(firstRow[3].classes).to.equal(undefined);

    expect(firstRow[4].text).to.equal("Escape");
    expect(firstRow[4].attributes).to.equal(undefined);
    expect(firstRow[4].classes).to.equal(undefined);

    expect(firstRow[5].text).to.equal("£234.56");
    expect(firstRow[5].attributes).to.deep.equal({ "data-sort-value": 234.56 });
    expect(firstRow[5].classes).to.equal("govuk-table__cell--numeric");

    // // Second row
    const secondRow = viewModel.rows[1]
    expect(secondRow[0]).to.have.property("html").that.is.a("string");
    const $a2 = load(secondRow[0].html as string)("a.govuk-link");
    expect($a2).to.have.length(1);
    expect($a2.attr("href")).to.equal(`/claims/${encodeURIComponent(String(claims[1].id))}`);
    expect($a2.clone().find(".govuk-visually-hidden").remove().end().text().trim()).to.equal("LAA-002");
    expect(secondRow[0].attributes).to.deep.equal({ 'data-sort-value': 2 });
    expect(secondRow[0].classes).to.equal(undefined);

    expect(secondRow[1].text).to.equal("");
    expect(secondRow[1].attributes).to.equal(undefined);
    expect(secondRow[1].classes).to.equal(undefined);

    expect(secondRow[2].text).to.equal("");
    expect(secondRow[2].attributes).to.equal(undefined);
    expect(secondRow[2].classes).to.equal(undefined);

    expect(secondRow[3].text).to.equal("");
    expect(secondRow[3].attributes).to.equal(undefined);
    expect(secondRow[3].classes).to.equal(undefined);

    expect(secondRow[4].text).to.equal("");
    expect(secondRow[4].attributes).to.equal(undefined);
    expect(secondRow[4].classes).to.equal(undefined);

    expect(secondRow[5].text).to.equal("");
    expect(secondRow[5].attributes).to.equal(undefined);
    expect(secondRow[5].classes).to.equal("govuk-table__cell--numeric");
  });

  it("paginates the data", () => {
    const claim: Claim = {
      id: 1,
      client: "Giordano",
      category: "Family",
      concluded: new Date("2025-03-18"),
      feeType: "Escape",
      claimed: 234.56,
      submissionId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const claims: Claim[] = new Array(100).fill(claim);

    const paginationMeta: PaginationMeta = {
      total: 100,
      page: 3,
      limit: 20,
    };

    const viewModel = new ClaimsTableViewModel(claims, paginationMeta, "/foo");

    expect(viewModel.pagination.results.count).to.equal(100);
    expect(viewModel.pagination.results.from).to.equal(41);
    expect(viewModel.pagination.results.to).to.equal(60);
    expect(viewModel.pagination.results.text).to.equal("results");

    expect(viewModel.pagination.previous?.text).to.equal("Previous");
    expect(viewModel.pagination.previous?.href).to.equal("/foo?page=2");

    expect(viewModel.pagination.next?.text).to.equal("Next");
    expect(viewModel.pagination.next?.href).to.equal("/foo?page=4");
  });
});
