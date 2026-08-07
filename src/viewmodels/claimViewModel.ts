import type { ClaimDto } from "#src/types/Claim.js";
import { formatClaimed, formatDate } from "#src/helpers/index.js";
import type { SummaryListRow } from "./components/summaryList.js";

/**
 *
 */
export class ClaimViewModel {
  readonly rows: SummaryListRow[];
  readonly title: string;
  readonly amendLink: string;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {ClaimDto} claim Array of claims
   */
  constructor(claim: ClaimDto) {
    this.title = "TODO";
    this.amendLink = `/claim/${claim.id}/amend`;
    const rows: SummaryListRow[] = [];

    rows.push({ key: { text: "Claim ID" }, value: { text: claim.id } });

    if (claim.ufn != null && claim.ufn !== "") {
      rows.push({ key: { text: "UFN" }, value: { text: claim.ufn } });
    }

    if (claim.client != null) {
      rows.push({
        key: { text: "Client" },
        value: { text: claim.client },
      });
    }

    if (claim.category != null) {
      rows.push({
        key: { text: "Category" },
        value: { text: claim.category },
      });
    }

    if (claim.concluded != null) {
      rows.push({
        key: { text: "Concluded" },
        value: { text: formatDate(claim.concluded) },
      });
    }

    if (claim.feeType != null) {
      rows.push({ key: { text: "Fee type" }, value: { text: claim.feeType } });
    }

    if (claim.claimed != null) {
      rows.push({
        key: { text: "Claimed" },
        value: { text: formatClaimed(claim.claimed) },
      });
    }

    this.rows = rows;
  }
}
