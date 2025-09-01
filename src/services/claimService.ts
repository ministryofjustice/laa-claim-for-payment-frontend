import { getClaimsEndpoint } from "#src/api/apiEndpointConstants.js";
import { transformClaim } from "#src/helpers/dataTransformers.js";
import { extractAndLogError } from "#src/helpers/index.js";
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { ApiResponse, PaginationMeta } from "#types/api-types.js";
import { AxiosInstanceWrapper } from "#types/axios-instance-wrapper.js";
import { Claim } from "#types/Claim.js";
import config from "../../config.js";

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = parseInt(process.env.PAGINATION_LIMIT ?? "20", 10); // Configurable via env
const EMPTY_TOTAL = 0;

class ClaimService {
  /**
   * Get submissions from API using axios middleware
   * @param {AxiosInstanceWrapper} axiosMiddleware - Axios middleware from request
   * @returns {Promise<ApiResponse<Claim>>} API response with submission data and pagination
   */
  static async getClaims(axiosMiddleware: AxiosInstanceWrapper): Promise<ApiResponse<Claim>> {
    const page = DEFAULT_PAGE;
    const limit = DEFAULT_LIMIT;

    // TODO: remove when Playwright job spins up BE
    if (process.env.NODE_ENV === "test") {
      const transformedData = Array.isArray(getClaimsSuccessResponseData.data)
        ? getClaimsSuccessResponseData.data.map(transformClaim)
        : [];
      return {
        data: transformedData,
        pagination: getClaimsSuccessResponseData.pagination,
        status: "success",
      };
    }
    try {
      const configuredAxios = ClaimService.configureAxiosInstance(axiosMiddleware);
      console.log(`API: GET ${getClaimsEndpoint}`);

      // Call API endpoint
      const response = await configuredAxios.get(getClaimsEndpoint);

      // Transform the response data if needed
      const transformedData = Array.isArray(response.data) ? response.data.map(transformClaim) : [];

      // TODO: Pagination not currently implemented
      const paginationMeta = ClaimService.extractPaginationMeta();

      console.log(`API: Returning ${transformedData.length} claims`);

      return {
        data: transformedData,
        pagination: paginationMeta,
        status: "success",
      };
    } catch (error) {
      const errorMessage = extractAndLogError(error, "API error");

      return {
        data: [],
        pagination: { total: EMPTY_TOTAL, page, limit },
        status: "error",
        message: errorMessage,
      };
    }
  }

  /**
   * Extract pagination metadata from response headers
   * @returns {PaginationMeta} Pagination metadata
   */
  private static extractPaginationMeta(): PaginationMeta {
    const page = DEFAULT_PAGE;
    const limit = DEFAULT_LIMIT;
    const total = 1;

    return {
      total,
      page: page,
      limit: limit,
      totalPages: undefined,
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
