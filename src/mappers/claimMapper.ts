import { Category, type Claim, CostType } from "#src/types/Claim.js";
import type { ClaimRequestBody, LineItemRequestBody } from "#src/generated/claim-api/index.js";
import type { LineItemForm } from "#src/types/poa.js";

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
 * @param {LineItemForm} form the UI line item form model
 * @returns {LineItemRequestBody} the backend line item model
 */
export function toLineItemRequestBody(
  form: LineItemForm,
): LineItemRequestBody {
  switch (form.type) {
    case CostType.EXPERT_COST:
      return {
        title: form.value.description,
        category: Category.DISBURSEMENT.toString(),
        date: form.value.activityDate.toIsoString(),
        actualNetValue: form.value.actualNetValue,
        vatApplicable: form.value.vatApplies,
        feeEarnerName: form.value.feeEarnerName,
      }
    case CostType.NON_EXPERT_DISBURSEMENT:
      return {
        title: form.value.description,
        category: Category.DISBURSEMENT.toString(),
        date: form.value.activityDate.toIsoString(),
        actualNetValue: form.value.actualNetValue,
        vatApplicable: form.value.vatApplies,
        feeEarnerName: form.value.feeEarnerName,
      }
    case CostType.PROFIT_COST:
      return {
        title: "TODO", // TODO - what should this be?
        category: Category.DISBURSEMENT.toString(),
        date: form.value.activityDate.toIsoString(),
        netProfitCostAmount: form.value.actualNetProfitCostExcludingAdvocacy,
        netAdvocacyCostAmount: form.value.actualNetAdvocacyCosts,
        vatApplicable: form.value.vatApplies,
        feeEarnerName: form.value.feeEarnerName,
      }
  }
}
