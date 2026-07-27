import type { Claim } from "#src/types/Claim.js";
import type { ClaimRequestBody } from "#src/generated/claim-api/index.js";

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
  };
}