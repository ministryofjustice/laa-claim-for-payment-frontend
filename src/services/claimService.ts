import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  addLineItemToClaim as addLineItemToClaimApi,
  createClaim as createClaimApi,
  getClaim as getClaimApi,
  getClaims as getClaimsApi,
  getLineItem as getLineItemApi,
  updateClaim as updateClaimApi,
  updateLineItem as updateLineItemApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type { ApiResponse, Paginated } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import {
  Claim,
  type ClaimDto,
  ClaimResponseSchema,
  ClaimsResponseSchema,
  type LineItem,
} from "#src/types/Claim.js";
import config from "../../config.js";
import { UUID } from "uuidv7";
import type { ClaimRequestBody } from "#src/generated/claim-api/index.js";
import {
  toClaimRequestBody,
  toLineItemRequestBody,
} from "#src/mappers/claimMapper.js";
import type { ExpertCostDetails, ProfitCostBillLine } from "#src/types/poa.js";
import type { AxiosResponse } from "axios";
import type { ZodType } from "zod";

interface ClaimServiceDeps {
  createClient: typeof createClient;
  getClaims: typeof getClaimsApi;
  getClaim: typeof getClaimApi;
  createClaim: typeof createClaimApi;
  updateClaim: typeof updateClaimApi;
  addLineItemToClaim: typeof addLineItemToClaimApi;
  getLineItem: typeof getLineItemApi;
  updateLineItem: typeof updateLineItemApi;
}

const defaultDeps: ClaimServiceDeps = {
  createClient,
  getClaims: getClaimsApi,
  getClaim: getClaimApi,
  createClaim: createClaimApi,
  updateClaim: updateClaimApi,
  addLineItemToClaim: addLineItemToClaimApi,
  getLineItem: getLineItemApi,
  updateLineItem: updateLineItemApi,
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
   * @returns {Promise<ApiResponse<Paginated<ClaimDto>>>} Parsed claims response in app response format.
   */
  static async getClaims(
    axiosMiddleware: AxiosInstanceWrapper,
    page?: number,
    limit?: number,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Paginated<ClaimDto>>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.getClaims({
        client: apiClient,
        query: { limit, page, status: "SUBMITTED" },
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
   * @param {UUID} claimId - Claim identifier.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<Claim>>} Parsed claim response in app response format.
   */
  static async getClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Claim>> {
    return await ClaimService.getClaimByStatus(
      axiosMiddleware,
      claimId,
      "SUBMITTED",
      deps,
    );
  }

  /**
   * Get a single draft claim from the API and return it in the app response shape.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<Claim>>} Parsed claim response in app response format.
   */
  static async getDraftClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Claim>> {
    return await ClaimService.getClaimByStatus(
      axiosMiddleware,
      claimId,
      "DRAFT",
      deps,
    );
  }

  private static async getClaimByStatus(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    status: "DRAFT" | "SUBMITTED",
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<Claim>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.getClaim({
        path: { claimId: claimId.toString() },
        query: { status },
        client: apiClient,
      });

      const parsed: ClaimDto = ClaimResponseSchema.parse(response.data);

      return {
        body: new Claim(parsed),
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Creates a draft claim and returns the ID in the Location header.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<UUID>>} Parsed claim ID in app response format.
   */
  static async createClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<UUID>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    const body: ClaimRequestBody = {};

    try {
      const response = await deps.createClaim<true>({
        body,
        query: { status: "DRAFT" },
        client: apiClient,
      });

      return {
        status: "success",
        body: getId(response, /\/claims\/([^?]+)/, 1),
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Updates a draft claim.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {Claim} claim - Claim.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} App response format.
   */
  static async updateClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claim: Claim,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      await deps.updateClaim({
        path: { id: claim.id },
        query: { status: "DRAFT" },
        body: toClaimRequestBody(claim),
        client: apiClient,
      });

      return {
        status: "success",
        body: null,
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Adds a line item to a draft claim and returns the ID in the Location header.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim ID.
   * @param {ExpertCostDetails | ProfitCostBillLine} lineItem - Line item.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} App response format.
   */
  static async addLineItemToClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItem?: ExpertCostDetails | ProfitCostBillLine,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<UUID>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.addLineItemToClaim<true>({
        path: { claimId: claimId.toString() },
        query: { status: "DRAFT" },
        body: lineItem == null ? {} : toLineItemRequestBody(lineItem),
        client: apiClient,
      });

      return {
        status: "success",
        body: getId(response, /\/claims\/([^/]+)\/line-items\/([^/?]+)/, 2),
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Get a line item.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {ZodType} schema - Schema to validate against.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse>} Parsed line item response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async getLineItem<T extends LineItem>(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    schema: ZodType<T>,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<T>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      const response = await deps.getLineItem({
        path: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        query: { status: "DRAFT" },
        client: apiClient,
      });

      return {
        body: schema.parse(response.data),
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Updates a line item.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {ExpertCostDetails | ProfitCostBillLine} lineItem - Line item.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} App response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async updateLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    lineItem: ExpertCostDetails | ProfitCostBillLine,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    const apiClient = deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });

    try {
      await deps.updateLineItem({
        path: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        query: { status: "DRAFT" },
        body: toLineItemRequestBody(lineItem),
        client: apiClient,
      });

      return {
        status: "success",
        body: null,
      };
    } catch (error) {
      return createApiError(error);
    }
  }
}

function getId(response: AxiosResponse, pattern: RegExp, group: number): UUID {
  if ("headers" in response) {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const { location } = response.headers;
    if (typeof location !== "string") {
      throw new Error("Missing Location header");
    }

    const match = pattern.exec(location);
    if (match == null) {
      throw new Error("Invalid Location header");
    }

    return UUID.parse(match[group]);
  }

  throw new Error("Response did not contain headers");
}

export const claimService = ClaimService;