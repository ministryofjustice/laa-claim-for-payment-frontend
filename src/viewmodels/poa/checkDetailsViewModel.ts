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
import { buildRoute, ROUTES } from "#routes/helper.js";
import { formatDateReadable } from "#src/helpers/dataFormatters.js";
import {
  clientStatusFieldName,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferOfSolicitorFieldName,
} from "#src/controllers/poa/profitCostDetailsController.js";

/**
 *
 */
export class CheckDetailsViewModel {
  readonly assessmentSummaryTable: Table;
  readonly profitCostDetailsSummaryList: SummaryList;
  readonly profitCostBillLineSummaryList: SummaryList;
  readonly expertCostBillLineSummaryLists: SummaryList[] = [];
  readonly evidenceSummaryList: SummaryList;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Array of claims
   */
  constructor(claim: Claim) {
    const { id: claimId } = claim;
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
          { text: "Circuit/district judge" },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${courtTypeFieldName}`
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientPartyStatus" },
          { text: "Child" },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${clientStatusFieldName}`
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.firstSolicitor" },
          { text: "Yes" },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${firstSolicitorFieldName}`
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor" },
          { text: "Yes" },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${transferOfSolicitorFieldName}`
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained" },
          { text: "1" },
          buildRoute(ROUTES.HOW_MANY_CLIENTS_RETAINED, { claimId })
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings" },
          { text: "Yes" },
          buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, { claimId })
        ),
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee" },
          { text: "No" },
          buildRoute(ROUTES.ESCAPING_FIXED_FEE, { claimId })
        )
      ]
    );

    this.profitCostBillLineSummaryList = buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title" },
      "profit-cost-bill-line",
      [
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.date" },
          { text: "20 December 2023" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netProfitCost" },
          { text: "£150" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netAdvocacyCost" },
          { text : "£150" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.doesVatApply" },
          { text: "Yes" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.profitCostBillLine.feeEarnerName" },
          { text: "Carol Spencer" }
        )
      ],
[      {
        href: buildRoute(ROUTES.CPGFS_PROFIT_COST_BILL_LINE, { claimId }),
        text: {
          key: "common.change"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title"
        }
      }]
    );

    this.expertCostBillLineSummaryLists.push(buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title" },
      'expert-cost-bill-line',
      [
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.date" },
          { text: "20 December 2023" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.actualNetValue" },
          { text: "£150" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.doesVatApply" },
          { text: "Yes" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.feeEarnerName" },
          { text: "Carol Spencer" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.description" },
          { text: "Cost of petrol" }
        )
      ],
      [
      {
        href: "#",
        text: {
          key: "common.delete"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title"
        }
      },{
        href: buildRoute(ROUTES.EXPERT_COST_DETAILS, { claimId, expertCostId: 1 }),
        text: {
          key: "common.change"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title"
        }
      }
    ]
    ));

        this.expertCostBillLineSummaryLists.push(buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title" },
      'expert-cost-bill-line',
      [
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.date" },
          { text: "20 December 2023" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.actualNetValue" },
          { text: "£150" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.doesVatApply" },
          { text: "Yes" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.feeEarnerName" },
          { text: "Carol Spencer" }
        ),
        buildSummaryListRow(
          { key: "pages.poa.checkYourDetails.cya.expertCostBillLine.description" },
          { text: "Cost of petrol" }
        )
      ],
      [
      {
        href: "#",
        text: {
          key: "common.delete"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title"
        }
      },{
        href: buildRoute(ROUTES.EXPERT_COST_DETAILS, { claimId, expertCostId: 2 }),
        text: {
          key: "common.change"
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title"
        }
      }
    ]
    ));

    this.evidenceSummaryList = buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.evidence.title" },
      "evidence",
      claim.evidence?.map(
        (evidence: EvidenceItem): SummaryListRow =>
          buildSummaryListRow(evidence.fileKey, {
            html: {
              key: "pages.poa.checkYourDetails.cya.evidence.value",
              args: {
                fileSize: formatFileSize(evidence.fileSize),
                submittedOn: formatDateReadable(evidence.submittedOn)
              }
            },
          }),
      ) ?? [],
[      {
        href: "#", // TODO
        text: {
          key: "common.change",
        },
        visuallyHiddenText: {
          key: "pages.poa.checkYourDetails.cya.evidence.title",
        },
      }],
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
