import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import { type Claim, type CostType , ClaimStatus } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { uploadService } from "#src/services/uploadService.js";
import type { ApiResponse } from "#src/types/api-types.js";
import { UUID } from "uuidv7";

export const draftService = {
  async setEscapedFlag(
    axiosMiddleware: AxiosInstanceWrapper,
    claim: Claim,
    value: boolean,
  ): Promise<ApiResponse<null>> {
    if (!value && claim.hasEvidence) {
      await uploadService.deleteAllEvidenceFromClaim(
        axiosMiddleware,
        UUID.parse(claim.id),
        ClaimStatus.DRAFT,
      );
    }

    return await claimService.updateClaim(
      axiosMiddleware,
      claim.setEscapedFlag(value),
    );
  },

  async setCostType(
    axiosMiddleware: AxiosInstanceWrapper,
    claim: Claim,
    value: CostType,
  ): Promise<ApiResponse<null>> {
    const hasAnswerChanged = claim.costType !== value;
    if (hasAnswerChanged && claim.hasEvidence) {
      await uploadService.deleteAllEvidenceFromClaim(
        axiosMiddleware,
        UUID.parse(claim.id),
        ClaimStatus.DRAFT,
      );
    }

    // TODO - delete all line items

    return await claimService.updateClaim(
      axiosMiddleware,
      claim.setCostType(value),
    );
  },
};
