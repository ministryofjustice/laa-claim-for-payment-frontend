import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  getClaim as getClaimApi,
  getClaims as getClaimsApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { extractAndLogError } from "#src/helpers/index.js";
import type { ApiResponse, Paginated } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import { type Claim, ClaimResponseSchema, ClaimsResponseSchema } from "#src/types/Claim.js";
import config from "../../config.js";

interface ClaimServiceDeps {
  createClient: typeof createClient;
  getClaims: typeof getClaimsApi;
  getClaim: typeof getClaimApi;
}

const defaultDeps: ClaimServiceDeps = {
  createClient,
  getClaims: getClaimsApi,
  getClaim: getClaimApi,
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
    deps: ClaimServiceDeps = defaultDeps
  ): Promise<ApiResponse<Paginated<Claim>>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
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
      const errorMessage = extractAndLogError(error, "API error");

      return {
        status: "error",
        message: errorMessage,
      };
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
    deps: ClaimServiceDeps = defaultDeps
  ): Promise<ApiResponse<Claim>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
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
      const errorMessage = extractAndLogError(error, "API error");

      return {
        status: "error",
        message: errorMessage,
      };
    }
  }
}

export const claimService = ClaimService;