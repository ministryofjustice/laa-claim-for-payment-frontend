import type { Claim } from "#src/types/Claim.js";
import type { Table } from "#src/viewmodels/components/table.js";
import type { TableCell, TableHeader } from "#src/viewmodels/components/index.js";

/**
 *
 */
export class CheckDetailsViewModel {
  readonly assessmentSummary: Table;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   */
  constructor(claim: Claim) {
    const head: TableHeader[] = [
      { text: { key: "pages.poa.checkYourDetails.assessmentSummary.item" } },
      { text: { key: "pages.poa.checkYourDetails.assessmentSummary.cost" } },
    ];

    const rows: TableCell[][] = [
      [
        {
          text: { key: "pages.poa.checkYourDetails.assessmentSummary.totalNetClaim" },
        },
        {
          text: "£0",
        }
      ],
      [
        {
          text: { key: "pages.poa.checkYourDetails.assessmentSummary.totalVatClaim" },
        },
        {
          text: "£0",
        }
      ],
      [
        {
          text: { key: "pages.poa.checkYourDetails.assessmentSummary.poaTotalNetClaim" },
        },
        {
          text: "£0",
        }
      ],
      [
        {
          text: { key: "pages.poa.checkYourDetails.assessmentSummary.totalClaim" },
        },
        {
          text: "£0",
        }
      ]
    ];

    this.assessmentSummary = { head, rows };
  }
}
