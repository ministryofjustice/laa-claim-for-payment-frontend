/**
 * @description Tests for the claims table view model
 */

import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { Claim } from "#src/types/Claim.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect } from "chai";
import { PaginationMeta } from "#src/types/api-types.js";

describe("constructor()", () => {
  it("creates a series of headers", () => {
    const claims: Claim[] = getClaimsSuccessResponseData.data;

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
    expect(viewModel.rows[0][0].text).to.equal("LAA-001");
    expect(viewModel.rows[0][0].attributes).to.equal(undefined);
    expect(viewModel.rows[0][0].classes).to.equal(undefined);

    expect(viewModel.rows[0][1].text).to.equal("Giordano");
    expect(viewModel.rows[0][1].attributes).to.equal(undefined);
    expect(viewModel.rows[0][1].classes).to.equal(undefined);

    expect(viewModel.rows[0][2].text).to.equal("Family");
    expect(viewModel.rows[0][2].attributes).to.equal(undefined);
    expect(viewModel.rows[0][2].classes).to.equal(undefined);

    expect(viewModel.rows[0][3].text).to.equal("18/03/2025");
    expect(viewModel.rows[0][3].attributes).to.deep.equal({ "data-sort-value": 1742256000000 });
    expect(viewModel.rows[0][3].classes).to.equal(undefined);

    expect(viewModel.rows[0][4].text).to.equal("Escape");
    expect(viewModel.rows[0][4].attributes).to.equal(undefined);
    expect(viewModel.rows[0][4].classes).to.equal(undefined);

    expect(viewModel.rows[0][5].text).to.equal("£234.56");
    expect(viewModel.rows[0][5].attributes).to.deep.equal({ "data-sort-value": 234.56 });
    expect(viewModel.rows[0][5].classes).to.equal("govuk-table__cell--numeric");

    // Second row
    expect(viewModel.rows[1][0].text).to.equal("LAA-002");
    expect(viewModel.rows[1][0].attributes).to.equal(undefined);
    expect(viewModel.rows[1][0].classes).to.equal(undefined);

    expect(viewModel.rows[1][1].text).to.equal("");
    expect(viewModel.rows[1][1].attributes).to.equal(undefined);
    expect(viewModel.rows[1][1].classes).to.equal(undefined);

    expect(viewModel.rows[1][2].text).to.equal("");
    expect(viewModel.rows[1][2].attributes).to.equal(undefined);
    expect(viewModel.rows[1][2].classes).to.equal(undefined);

    expect(viewModel.rows[1][3].text).to.equal("");
    expect(viewModel.rows[1][3].attributes).to.equal(undefined);
    expect(viewModel.rows[1][3].classes).to.equal(undefined);

    expect(viewModel.rows[1][4].text).to.equal("");
    expect(viewModel.rows[1][4].attributes).to.equal(undefined);
    expect(viewModel.rows[1][4].classes).to.equal(undefined);

    expect(viewModel.rows[1][5].text).to.equal("");
    expect(viewModel.rows[1][5].attributes).to.equal(undefined);
    expect(viewModel.rows[1][5].classes).to.equal("govuk-table__cell--numeric");
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
