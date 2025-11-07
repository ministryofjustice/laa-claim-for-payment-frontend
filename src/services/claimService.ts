import { getClaimsEndpoint } from "#src/api/apiEndpointConstants.js";
import { extractAndLogError } from "#src/helpers/index.js";
import type { ApiResponse, Paginated, PaginationMeta } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import { type Claim, ClaimSchema } from "#src/types/Claim.js";
import config from "../../config.js";
import { z } from "zod";

/**
 * Service to interact with the Claims API.
 */
class ClaimService {
  /**
   * Get submissions from API using axios middleware
   * @param {AxiosInstanceWrapper} axiosMiddleware - Axios middleware from request
   * @param {number} page - The current page
   * @returns {Promise<ApiResponse<Claim>>} API response with submission data and pagination
   */
  static async getClaims(
    axiosMiddleware: AxiosInstanceWrapper,
    page: number
  ): Promise<ApiResponse<Paginated<Claim[]>>> {
    try {
      const configuredAxios = this.configureAxiosInstance(axiosMiddleware);
      console.log(`API: GET ${getClaimsEndpoint}`);

      // Call API endpoint
      const response = await configuredAxios.get(getClaimsEndpoint);

      // Validate and transform the data against the schema
      const data = z.array(ClaimSchema).parse(response.data);

      // TODO: Pagination not currently implemented. Update `data.length` when API response body includes the pagination data.
      const paginationMeta = ClaimService.extractPaginationMeta(data.length, page);

      console.log(`API: Returning ${data.length} claims`);

      return {
        body: {
          data: data,
          meta: paginationMeta,
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

  static async getClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number
  ): Promise<ApiResponse<Claim>> {
    try {
      const getClaimEndpoint = `/api/v1/claims/${encodeURIComponent(String(claimId))}`;
      const configuredAxios = this.configureAxiosInstance(axiosMiddleware);
      console.log(`API: GET ${getClaimEndpoint}`);

      // Call API endpoint
      const response = await configuredAxios.get<Claim>(getClaimEndpoint);

      const claim: Claim = response.data

      return {
        body: claim,
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
   * Extract pagination metadata from response body
   * @param {number} total - The total number of unpaginated results
   * @param {number} page - The current page
   * @returns {PaginationMeta} Pagination metadata
   */
  private static extractPaginationMeta(total: number, page: number): PaginationMeta { // todo does this actually do anything?
    return {
      total,
      page,
      limit: config.pagination.numberOfClaimsPerPage,
    };
  }

  /**
   * Create configured axios instance with API credentials
   * @param {AxiosInstanceWrapper} axiosMiddleware - Axios middleware from request
   * @returns {AxiosInstanceWrapper} Configured axios instance
   */
  private static configureAxiosInstance(
    axiosMiddleware: AxiosInstanceWrapper
  ): AxiosInstanceWrapper {
    // Override base URL and add API-specific headers
    const { axiosInstance } = axiosMiddleware;
    const { defaults } = axiosInstance;
    const {
      api: { baseUrl },
    } = config;

    // Safely configure axios defaults
    if (typeof baseUrl === "string") {
      defaults.baseURL = baseUrl;
    }

    defaults.headers.common["Content-Type"] = "application/json";
    defaults.headers.common.Accept = "application/json";

    return axiosMiddleware;
  }
}

// Export the service
export const claimService = ClaimService;
