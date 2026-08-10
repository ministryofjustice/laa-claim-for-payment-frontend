import {
  type ClaimDto,
  CostType,
  type EvidenceItem,
  type ExpertCostLineItem,
  type ProfitCostBillLineItem,
} from "#src/types/Claim.js";
import type { Table } from "#src/viewmodels/components/table.js";
import type {
  TableCell,
  TableHeader,
} from "#src/viewmodels/components/index.js";
import {
  buildSummaryListRow,
  buildSummaryListRowWithChangeLink,
  buildSummaryListWithCard,
  type SummaryList,
  type SummaryListRow,
} from "#src/viewmodels/components/summaryList.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  clientStatusFieldName,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferOfSolicitorFieldName,
} from "#src/controllers/poa/profitCostDetailsController.js";
import { AnswerMissingError } from "#src/types/errors.js";
import {
  formatBoolean,
  formatClaimed,
  formatDateReadable,
} from "#src/helpers/index.js";

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
   * @param {ClaimDto} claim Array of claims
   */
  constructor(claim: ClaimDto) {
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
          CheckDetailsViewModel.buildExpertCostLineItemSummaryLists(claim);
        break;
      case CostType.NON_EXPERT_DISBURSEMENT:
        break;
      default:
        throw new AnswerMissingError(
          buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId: claim.id }),
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

  private static buildProfitCostDetailsSummaryList(
    claim: ClaimDto,
  ): SummaryList {
    const { id: claimId } = claim;
    return buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.profitCostDetails.title" },
      "profit-cost-details",
      [
        buildSummaryListRowWithChangeLink(
          { key: "pages.poa.checkYourDetails.cya.profitCostDetails.courtType" },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${courtTypeFieldName}`,
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
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${clientStatusFieldName}`,
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
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${firstSolicitorFieldName}`,
          claim.firstActingSolicitorFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.firstActingSolicitorFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.transferOfSolicitor",
          },
          `${buildRoute(ROUTES.PROFIT_COST_DETAILS, { claimId })}#${transferOfSolicitorFieldName}`,
          claim.transferOfSolicitorFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.transferOfSolicitorFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.clientsRetained",
          },
          buildRoute(ROUTES.HOW_MANY_CLIENTS_RETAINED, { claimId }),
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
          buildRoute(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, { claimId }),
          claim.clientsStartCount == null
            ? undefined
            : {
                text: {
                  key: `pages.howManyClientsRetained.${claim.clientsStartCount}.text`,
                },
              },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.attendedHearings",
          },
          buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, { claimId }),
          claim.multiClientHearingFlag == null
            ? undefined
            : { text: { key: formatBoolean(claim.multiClientHearingFlag) } },
        ),
        buildSummaryListRowWithChangeLink(
          {
            key: "pages.poa.checkYourDetails.cya.profitCostDetails.escapedStandardFixedFee",
          },
          buildRoute(ROUTES.ESCAPING_FIXED_FEE, { claimId }),
          claim.escaped == null
            ? undefined
            : { text: { key: formatBoolean(claim.escaped) } },
        ),
      ],
    );
  }

  private static buildProfitCostBillLineItemSummaryLists(
    claim: ClaimDto,
  ): SummaryList[] {
    const result: SummaryList[] = [];
    const { id: claimId } = claim;
    (claim.lineItems ?? [])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
      .map((lineItem) => lineItem as ProfitCostBillLineItem)
      .forEach((lineItem: ProfitCostBillLineItem) => {
        result.push(
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
                href: buildRoute(ROUTES.CPGFS_PROFIT_COST_BILL_LINE, {
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
        );
      });
    return result;
  }

  private static buildExpertCostLineItemSummaryLists(
    claim: ClaimDto,
  ): SummaryList[] {
    const result: SummaryList[] = [];
    const { id: claimId } = claim;
    (claim.lineItems ?? [])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
      .map((lineItem) => lineItem as ExpertCostLineItem)
      .forEach((lineItem: ExpertCostLineItem, index: number) => {
        result.push(
          buildSummaryListWithCard(
            {
              key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title",
            },
            `expert-cost-bill-line-${index + 1}`,
            [
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.date",
                },
                { text: formatDateReadable(lineItem.date.toDate()) },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.actualNetValue",
                },
                { text: formatClaimed(lineItem.actualNetValue) },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.doesVatApply",
                },
                { text: { key: formatBoolean(lineItem.vatApplicable) } },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.feeEarnerName",
                },
                { text: lineItem.feeEarnerName },
              ),
              buildSummaryListRow(
                {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.description",
                },
                { text: lineItem.title },
              ),
            ],
            [
              {
                href: "#",
                text: {
                  key: "common.delete",
                },
                visuallyHiddenText: {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title",
                },
              },
              {
                href: buildRoute(
                  ROUTES.EXPERT_COST_DETAILS,
                  { claimId },
                  { lineItemId: lineItem.id },
                ),
                text: {
                  key: "common.change",
                },
                visuallyHiddenText: {
                  key: "pages.poa.checkYourDetails.cya.expertCostBillLine.title",
                },
              },
            ],
          ),
        );
      });
    return result;
  }

  private static buildEvidenceSummaryList(claim: ClaimDto): SummaryList {
    return buildSummaryListWithCard(
      { key: "pages.poa.checkYourDetails.cya.evidence.title" },
      "evidence",
      claim.evidence
        ?.map((evidence: EvidenceItem): SummaryListRow | undefined =>
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
        .filter((row) => row !== undefined) ?? [],
      [
        {
          href: buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, { claimId: claim.id }),
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
