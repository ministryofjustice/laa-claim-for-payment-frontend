import type { Claim } from "#types/Claim.js";
import {
  formatClaimed,
  formatClaimId,
  formatDate,
  formatOptionalString
} from "#src/helpers/index.js";

export class ClaimsTableViewModel {
  head: TableHeader[];
  rows: TableCell[][];

  /**
   * Creates a view model containing the table header and rows derived from the claims data
   * @param {Claim[]} claims Array of claims
   * @returns {ClaimsTableViewModel} a view model containing the table header and rows
   */
  constructor(claims: Claim[]) {
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
      { text: formatClaimId(claim.id) },
      { text: formatOptionalString(claim.client) },
      { text: formatOptionalString(claim.category) },
      {
        text: formatDate(claim.concluded),
        attributes:
          claim.concluded != null
            ? { "data-sort-value": claim.concluded.getTime() }
            : undefined,
      },
      { text: formatOptionalString(claim.feeType) },
      {
        text: formatClaimed(claim.claimed),
        attributes:
          claim.claimed != null
            ? { "data-sort-value": claim.claimed }
            : undefined,
        classes: "govuk-table__cell--numeric",
      },
    ]);
  }
}

export interface TableCell {
  text: string;
  attributes?: Record<string, string | number | undefined>;
  classes?: string;
}

export interface TableHeader extends TableCell {
  attributes: { "aria-sort": "ascending" | "none" | "descending" };
}
