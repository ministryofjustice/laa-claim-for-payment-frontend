import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  getClaim as getClaimApi,
  getClaims as getClaimsApi,
  linkEvidenceToLineItem as linkEvidenceToLineItemApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type { ApiResponse, Paginated } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import {
  type Claim,
  ClaimResponseSchema,
  ClaimsResponseSchema,
} from "#src/types/Claim.js";
import config from "../../config.js";

interface ClaimServiceDeps {
  createClient: typeof createClient;
  getClaims: typeof getClaimsApi;
  getClaim: typeof getClaimApi;
  linkEvidenceToLineItem: typeof linkEvidenceToLineItemApi;
}

const defaultDeps: ClaimServiceDeps = {
  createClient,
  getClaims: getClaimsApi,
  getClaim: getClaimApi,
  linkEvidenceToLineItem: linkEvidenceToLineItemApi,
};

/**
 *
 */
class ClaimService {
  /**
   * Get claims from the API and return them in the app response shape.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {number} [page] - Page number to request.
   * @param {number} [limit] - Maximum number of claims per page.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<Paginated<Claim>>>} Parsed claims response in app response format.
   */
  static async getClaims(
    axiosMiddleware: AxiosInstanceWrapper,
    page?: number,
    limit?: number,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Paginated<Claim>>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.getClaims({
        client: apiClient,
        query: { limit, page },
      });

      const parsed = ClaimsResponseSchema.parse(response.data);
      const { claims: data } = parsed;
      const meta = parsed;

      return {
        body: {
          data,
          meta,
        },
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Get a single claim from the API and return it in the app response shape.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {number} claimId - Claim identifier.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<Claim>>} Parsed claim response in app response format.
   */
  static async getClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Claim>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.getClaim({
        path: { claimId },
        client: apiClient,
      });

      const parsed = ClaimResponseSchema.parse(response.data);

      return {
        body: parsed,
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Link an array of evidence IDs to the given line item ID.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {number} claimId - Claim identifier.
   * @param {number} lineItemId - Line item identifier.
   * @param {number[]} evidenceIds - Evidence identifiers.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  static async linkEvidenceToLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    lineItemId: number,
    evidenceIds: number[],
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      await deps.linkEvidenceToLineItem({
        client: apiClient,
        path: {
          claimId,
          lineItemId,
        },
        body: evidenceIds,
      });

      return {
        body: null,
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }
}

export const claimService = ClaimService;