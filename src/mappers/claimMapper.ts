import { Category, type Claim } from "#src/types/Claim.js";
import type { ClaimRequestBody, LineItemRequestBody } from "#src/generated/claim-api/index.js";
import type { ExpertCostDetails, ProfitCostBillLine } from "#src/types/poa.js";

/**
 * Maps a UI claim model to a backend claim model
 *
 * @param {Claim} claim the UI claim model
 * @returns {ClaimRequestBody} the backend claim model
 */
export function toClaimRequestBody(claim: Claim): ClaimRequestBody {
  return {
    costType: claim.costType ?? undefined,
    courtType: claim.courtType ?? undefined,
    clientPartyStatus: claim.clientPartyStatus ?? undefined,
    firstActingSolicitorFlag: claim.firstActingSolicitorFlag ?? undefined,
    transferOfSolicitorFlag: claim.transferOfSolicitorFlag ?? undefined,
    clientsRetainedCount: claim.clientsRetainedCount ?? undefined,
    clientsStartCount: claim.clientsStartCount ?? undefined,
    multiClientHearingFlag: claim.multiClientHearingFlag ?? undefined,
    escaped: claim.escapedFlag ?? undefined,
  };
}

/**
 * Maps a UI line item model to a backend line item model
 *
 * @param {ExpertCostDetails | ProfitCostBillLine} value the UI line item model
 * @returns {LineItemRequestBody} the backend line item model
 */
export function toLineItemRequestBody(
  value: ExpertCostDetails | ProfitCostBillLine,
): LineItemRequestBody {
  if ("description" in value) {
    return {
      title: value.description,
      category: Category.DISBURSEMENT.toString(),
      date: value.activityDate.toISOString(),
      actualNetValue: value.actualNetValue,
      vatApplicable: value.vatApplies,
      feeEarnerName: value.feeEarnerName,
    };
  } else {
    return {
      title: "TODO", // TODO - what should this be?
      category: Category.DISBURSEMENT.toString(),
      date: value.activityDate.toISOString(),
      netProfitCostAmount: value.actualNetProfitCostExcludingAdvocacy,
      netAdvocacyCostAmount: value.actualNetAdvocacyCosts,
      vatApplicable: value.vatApplies,
      feeEarnerName: value.feeEarnerName,
    };
  }
}
