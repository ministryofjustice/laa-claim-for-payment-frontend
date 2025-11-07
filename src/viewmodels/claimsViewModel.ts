import type { Claim } from "#src/types/Claim.js";
import type { TableCell, TableHeader } from "#src/viewmodels/components/index.js";
import {
  formatClaimed,
  formatClaimId,
  formatDate,
  formatOptionalString,
} from "#src/helpers/index.js";
import { Pagination } from "./components/pagination.js";
import type { PaginationMeta } from "#src/types/api-types.js";

/**
 *
 */
export class ClaimsTableViewModel {
  head: TableHeader[];
  rows: TableCell[][];
  pagination: Pagination;

  /**
   * Creates a view model containing the table header and rows derived from the claims data
   * @param {Claim[]} claims Array of claims
   * @param {PaginationMeta} paginationMeta The pagination metadata
   * @param {string} href The href of the page
   */
  constructor(claims: Claim[], paginationMeta: PaginationMeta, href: string) {
    this.head = [
      { text: "ID", attributes: { "aria-sort": "ascending" } },
      { text: "Client", attributes: { "aria-sort": "none" } },
      { text: "Category", attributes: { "aria-sort": "none" } },
      { text: "Concluded", attributes: { "aria-sort": "none" } },
      { text: "Fee Type", attributes: { "aria-sort": "none" } },
      {
        text: "Claimed",
        attributes: { "aria-sort": "none" },
        classes: "govuk-table__header--numeric",
      },
    ];

    this.rows = claims.map((claim) => [
      {
        html: `<a class="govuk-link" href="/claims/${encodeURIComponent(claim.id)}">
                ${formatClaimId(claim.id)}
                <span class="govuk-visually-hidden"> – view claim</span>
              </a>`,
        attributes: { "data-sort-value": claim.id }
      },
      { text: formatOptionalString(claim.client) },
      { text: formatOptionalString(claim.category) },
      {
        text: formatDate(claim.concluded),
        attributes:
          claim.concluded == null ? undefined : { "data-sort-value": claim.concluded.getTime() },
      },
      { text: formatOptionalString(claim.feeType) },
      {
        text: formatClaimed(claim.claimed),
        attributes: claim.claimed == null ? undefined : { "data-sort-value": claim.claimed } ,
        classes: "govuk-table__cell--numeric",
      },
    ]);

    this.pagination = new Pagination(
      paginationMeta.total,
      paginationMeta.limit,
      paginationMeta.page,
      href
    );
  }
}


