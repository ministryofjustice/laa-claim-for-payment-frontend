import { getClaimsEndpoint } from "#src/api/apiEndpointConstants.js";
import { extractAndLogError } from "#src/helpers/index.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import type { ApiResponse, PaginationMeta } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import { type Claim, ClaimSchema } from "#src/types/Claim.js";
import config from "../../config.js";
import { z } from "zod";

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = parseInt(process.env.PAGINATION_LIMIT ?? "20", 10); // Configurable via env
const EMPTY_TOTAL = 0;

/**
 *
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
  ): Promise<ApiResponse<Claim>> {
    // TODO: remove when Playwright job spins up BE
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "local") {
      return {
        data: getClaimsSuccessResponseData.data,
        pagination: getClaimsSuccessResponseData.pagination,
        status: "success",
      };
    }
    try {
      const configuredAxios = ClaimService.configureAxiosInstance(axiosMiddleware);
      console.log(`API: GET ${getClaimsEndpoint}`);

      // Call API endpoint
      const response = await configuredAxios.get(getClaimsEndpoint);

      // Validate and transform the data against the schema
      const data = z.array(ClaimSchema).parse(response.data);

      // TODO: Pagination not currently implemented. Update `data.length` when API response body includes the pagination data.
      const paginationMeta = ClaimService.extractPaginationMeta(data.length, page);

      console.log(`API: Returning ${data.length} claims`);

      return {
        data,
        pagination: paginationMeta,
        status: "success",
      };
    } catch (error) {
      const errorMessage = extractAndLogError(error, "API error");

      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit: config.pagination.numberOfClaimsPerPage,
        },
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
  private static extractPaginationMeta(total: number, page: number): PaginationMeta {
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
