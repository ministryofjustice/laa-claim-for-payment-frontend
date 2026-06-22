import type { Claim, EvidenceItem } from "#src/types/Claim.js";
import type { Table } from "#src/viewmodels/components/table.js";
import type { TableCell, TableHeader } from "#src/viewmodels/components/index.js";
import {
  buildSummaryListRow,
  buildSummaryListRowWithChangeLink,
  buildSummaryListWithCard,
  type SummaryList,
  type SummaryListRow
} from "#src/viewmodels/components/summaryList.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

/**
 *
 */
export class CheckDetailsViewModel {
  readonly assessmentSummaryTable: Table;
  readonly profitCostDetailsSummaryList: SummaryList;
  readonly profitCostBillLineSummaryList: SummaryList;
  readonly evidenceSummaryList: SummaryList;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   */
  constructor(claim: Claim) {
    this.assessmentSummaryTable = {
      caption: {
        key: "pages.poa.checkYourDetails.assessmentSummary.title"
      },
      captionClasses: "govuk-table__caption--m",
      firstCellIsHeader: true,
      head: CheckDetailsViewModel.buildAssessmentSummaryTableHead(),
      rows: CheckDetailsViewModel.buildAssessmentSummaryTableRows()
    };

    this.profitCostDetailsSummaryList = buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.profitCostDetails.title" },
      "profit-cost-details",
      [
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.courtType" },
          "Circuit/district judge",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientPartyStatus" },
          "Child",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.firstSolicitor" },
          "Yes",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor" },
          "Yes",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained" },
          "1",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings" },
          "Yes",
          "#"
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee" },
          "No",
          "#"
        )
      ]
    );

    this.profitCostBillLineSummaryList = buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title" },
      "profit-cost-bill-line",
      [
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.date" },
          "20 December 2023"
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netProfitCost" },
          "£150"
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netAdvocacyCost" },
          "£150"
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.doesVatApply" },
          "Yes"
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.feeEarnerName" },
          "Carol Spencer"
        )
      ],
      {
        href: "#",
        text: {
          key: "common.change"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title"
        }
      }
    );

    this.evidenceSummaryList = buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.evidence.title" },
      "evidence",
      claim.evidence?.map((evidence: EvidenceItem): SummaryListRow => buildSummaryListRow(
          evidence.fileKey,
          formatFileSize(evidence.fileSize),
        )) ?? [],
      {
        href: "#", // TODO
        text: {
          key: "common.change"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.evidence.title"
        }
      }
    );
  }

  private static buildAssessmentSummaryTableHead(): TableHeader[] {
    return [
      { text: { key: "pages.poa.checkYourDetails.assessmentSummary.item" } },
      { text: { key: "pages.poa.checkYourDetails.assessmentSummary.cost" } },
    ];
  }

  private static buildAssessmentSummaryTableRows(): TableCell[][] {
    return [
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
  }
}
