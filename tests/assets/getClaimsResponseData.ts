import type { ApiResponse, Paginated } from "#src/types/api-types.js";
import { Claim, ClaimDto } from "#src/types/Claim.js";
import { claim1, claim2, claim3, claim4 } from "./claim.js";

export const getClaimSuccessResponseData: ApiResponse<Claim> = {
  body: new Claim({...claim1}),
  status: "success",
}

export const getClaimsSuccessResponseData: ApiResponse<Paginated<ClaimDto>> = {
  body: {
    meta: {
      total: 1,
      page: 0,
      limit: 20,
      totalPages: undefined,
    },
    data: [
      claim1,
      claim2,
      claim3,
      claim4
    ],
  },
  status: "success",
};

export const linkLineItemToEvidenceResponseData: ApiResponse<null> = {
  body: null,
  status: "success",
}
