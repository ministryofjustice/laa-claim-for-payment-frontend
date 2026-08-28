import { type Claim, CostType, type DisbursementLineItem, type EvidenceItem } from "#src/types/Claim.js";
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
import { AnswerMissingError } from "#src/types/errors.js";
import { formatBoolean, formatClaimed, formatDateReadable } from "#src/helpers/index.js";

/**
 *
 */
export class CheckDetailsViewModel {
  readonly assessmentSummaryTable: Table;
  readonly profitCostDetailsSummaryList?: SummaryList = undefined;
  readonly lineItemSummaryLists: SummaryList[] = [];
  readonly evidenceSummaryList: SummaryList;

  /**
   * Creates a view model containing the summary rows derived from the claim data
   * @param {Claim} claim Claim
   */
  constructor(claim: Claim) {
    this.assessmentSummaryTable = {
      caption: {
        key: "pages.poa.checkYourDetails.assessmentSummary.title",
      },
      captionClasses: "govuk-table__caption--m",
      firstCellIsHeader: true,
      head: CheckDetailsViewModel.buildAssessmentSummaryTableHead(),
      rows: CheckDetailsViewModel.buildAssessmentSummaryTableRows(),
    };

    switch (claim.costType) {
      case CostType.PROFIT_COST:
        this.profitCostDetailsSummaryList =
          CheckDetailsViewModel.buildProfitCostDetailsSummaryList(claim);
        this.lineItemSummaryLists =
          CheckDetailsViewModel.buildProfitCostBillLineItemSummaryLists(claim);
        break;
      case CostType.EXPERT_COST:
        this.lineItemSummaryLists =
          CheckDetailsViewModel.buildLineItemSummaryLists(
            claim,
            "pages.poa.checkYourDetails.cya.disbursementBillLine.title.expertCost",
          );
        break;
      case CostType.NON_EXPERT_DISBURSEMENT:
        this.lineItemSummaryLists =
          CheckDetailsViewModel.buildLineItemSummaryLists(
            claim,
            "pages.poa.checkYourDetails.cya.disbursementBillLine.title.nonExpertDisbursement",
          );
        break;
      default:
        throw new AnswerMissingError(
          buildRoute(ROUTES.POA.CLAIM_TYPE, { claimId: claim.id }),
        );
    }

    this.evidenceSummaryList =
      CheckDetailsViewModel.buildEvidenceSummaryList(claim);
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
          text: {
            key: "pages.poa.checkYourDetails.assessmentSummary.totalNetClaim",
          },
        },
        {
          text: "£0",
        },
      ],
      [
        {
          text: {
            key: "pages.poa.checkYourDetails.assessmentSummary.totalVatClaim",
          },
        },
        {
          text: "£0",
        },
      ],
      [
        {
          text: {
            key: "pages.poa.checkYourDetails.assessmentSummary.poaTotalNetClaim",
          },
        },
        {
          text: "£0",
        },
      ],
      [
        {
          text: {
            key: "pages.poa.checkYourDetails.assessmentSummary.totalClaim",
          },
        },
        {
          text: "£0",
        },
      ],
    ];
  }

  private static buildProfitCostDetailsSummaryList(claim: Claim): SummaryList {
    const { id: claimId } = claim;
    return buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.profitCostDetails.title" },
      "profit-cost-details",
      [
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.courtType" },
          `${buildRoute(ROUTES.POA.PROFIT_COST.DETAILS, { claimId })}#courtTypeChoice`,
          claim.courtType == null
            ? undefined
            : {
                text: {
                  key: `pages.profitCostDetails.courtType.${claim.courtType}.text`,
                },
              },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientPartyStatus",
          },
          `${buildRoute(ROUTES.POA.PROFIT_COST.DETAILS, { claimId })}#clientStatusChoice`,
          claim.clientPartyStatus == null
            ? undefined
            : {
                text: {
                  key: `pages.profitCostDetails.clientStatus.${claim.clientPartyStatus}.text`,
                },
              },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.firstSolicitor",
          },
          `${buildRoute(ROUTES.POA.PROFIT_COST.DETAILS, { claimId })}#firstSolicitorChoice`,
          claim.firstActingSolicitorFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.firstActingSolicitorFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor",
          },
          `${buildRoute(ROUTES.POA.PROFIT_COST.DETAILS, { claimId })}#transferOfSolicitorChoice`,
          claim.transferOfSolicitorFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.transferOfSolicitorFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained",
          },
          buildRoute(ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED, { claimId }),
          claim.clientsRetainedCount == null
            ? undefined
            : {
                text: {
                  key: `pages.howManyClientsRetained.${claim.clientsRetainedCount}.text`,
                },
              },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsStart",
          },
          buildRoute(ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE, { claimId }),
          claim.clientsStartCount == null
            ? undefined
            : {
                text: {
                  key: `pages.numberOfClientsStartOfCase.${claim.clientsStartCount}.text`,
                },
              },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings",
          },
          buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS, { claimId }),
          claim.multiClientHearingFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.multiClientHearingFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee",
          },
          buildRoute(ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE, { claimId }),
          claim.escapedFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.escapedFlag) } },
        ),
      ],
    );
  }

  private static buildProfitCostBillLineItemSummaryLists(
    claim: Claim,
  ): SummaryList[] {
    const { id: claimId, profitCostLineItem: lineItem } = claim;
    if (lineItem != null) {
      return [
        buildSummaryListWithCard(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
          },
          "profit-cost-bill-line",
          [
            buildSummaryListRow(
              {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.date",
              },
              { text: formatDateReadable(lineItem.date.toDate()) },
            ),
            buildSummaryListRow(
              {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netProfitCost",
              },
              { text: formatClaimed(lineItem.netProfitCostAmount) },
            ),
            buildSummaryListRow(
              {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.netAdvocacyCost",
              },
              { text: formatClaimed(lineItem.netAdvocacyCostAmount) },
            ),
            buildSummaryListRow(
              {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.doesVatApply",
              },
              { text: { key: formatBoolean(lineItem.vatApplicable) } },
            ),
            buildSummaryListRow(
              {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.feeEarnerName",
              },
              { text: lineItem.feeEarnerName },
            ),
          ],
          [
            {
              href: buildRoute(ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE, {
                claimId,
              }),
              text: {
                key: "common.change",
              },
              visuallyHiddenText: {
                key: "pages.poa.checkYourDetails.cya.profitCostBillLine.title",
              },
            },
          ],
        ),
      ]
    }
    return [];
  }

  private static buildLineItemSummaryLists(
    claim: Claim,
    title: string,
  ): SummaryList[] {
    const result: SummaryList[] = [];
    const { id: claimId } = claim;
    claim.lineItems
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
      .map((lineItem) => lineItem as DisbursementLineItem)
      .forEach((lineItem: DisbursementLineItem, index: number) => {
        result.push(
          buildSummaryListWithCard(
            {
              key: title,
            },
            `disbursement-bill-line-${index + 1}`,
            [
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.date",
                },
                { text: formatDateReadable(lineItem.date.toDate()) },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.actualNetValue",
                },
                { text: formatClaimed(lineItem.actualNetValue) },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.doesVatApply",
                },
                { text: { key: formatBoolean(lineItem.vatApplicable) } },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.feeEarnerName",
                },
                { text: lineItem.feeEarnerName },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.description",
                },
                { text: lineItem.title },
              ),
            ],
            [
              {
                href: buildRoute(ROUTES.POA.DISBURSEMENTS.REMOVE, {
                  claimId,
                  lineItemId: lineItem.id,
                }),
                text: {
                  key: "common.delete",
                },
                visuallyHiddenText: {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.title",
                },
              },
              {
                href: buildRoute(
                  ROUTES.POA.DISBURSEMENTS.DETAILS,
                  { claimId },
                  { lineItemId: lineItem.id },
                ),
                text: {
                  key: "common.change",
                },
                visuallyHiddenText: {
                  key: "pages.poa.checkYourDetails.cya.disbursementBillLine.title",
                },
              },
            ],
          ),
        );
      });
    return result;
  }

  private static buildEvidenceSummaryList(claim: Claim): SummaryList {
    return buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.evidence.title" },
      "evidence",
      claim.evidence
        .map((evidence: EvidenceItem): SummaryListRow | undefined =>
          buildSummaryListRow(evidence.fileKey, {
            html: {
              key: "pages.poa.checkYourDetails.cya.evidence.value",
              args: {
                fileSize: formatFileSize(evidence.fileSize),
                submittedOn: formatDateReadable(new Date(evidence.submittedOn)),
              },
            },
          }),
        )
        .filter((row) => row !== undefined),
      [
        {
          href: buildRoute(ROUTES.POA.EVIDENCE_UPLOAD, { claimId: claim.id }),
          text: {
            key: "common.change",
          },
          visuallyHiddenText: {
            key: "pages.poa.checkYourDetails.cya.evidence.title",
          },
        },
      ],
    );
  }
}
