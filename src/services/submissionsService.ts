import { getSubmissionsEndpoint } from "#src/api/apiEndpointConstants.js"
import { isRecord, safeString } from "#src/helpers/dataTransformers.js";
import { formatDate } from "#src/helpers/dateFormatter.js";
import { extractAndLogError } from "#src/helpers/index.js";
import { ApiResponse, PaginationMeta } from "#types/api-types.js";
import { AxiosInstanceWrapper } from "#types/axios-instance-wrapper.js";
import { Claim } from "#types/Claim.js";
import { Submission } from "#types/Submission.js"
import config from '../../config.js';

/**
 * Transform raw submission item to display format
 * @param {unknown} item Raw submission item
 * @returns {Submission} Transformed submission item
 */
export function transformSubmission(item: unknown): Submission {
  const arrayOfClaims: Claim[] = [];
  if (!isRecord(item)) {
    throw new Error('Invalid submissions item: expected object');
  }

  return {
    id: safeString(item.id),
    friendlyId: safeString(item.friendlyId),
    providerUserId: safeString(item.providerUserId),
    providerOfficeId: safeString(item.providerOfficeId),
    submissionTypeCode: (safeString(item.submissionTypeCode)),
    submissionDate: formatDate(safeString(item.submissionDate)),
    submissionPeriodStartDate: formatDate(safeString(item.submissionPeriodStartDate)),
    submissionPeriodEndDate: formatDate(safeString(item.submissionPeriodEndDate)),
    scheduleId: formatDate(safeString(item.scheduleId)),
    claims: arrayOfClaims,
  };
}

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = parseInt(process.env.PAGINATION_LIMIT ?? '20', 10); // Configurable via env
const JSON_INDENT = 2;
const EMPTY_TOTAL = 0;


class SubmissionService {
  /**
   * Get submissions from API using axios middleware
   * @param {AxiosInstanceWrapper} axiosMiddleware - Axios middleware from request
   * @returns {Promise<ApiResponse<Submission>>} API response with submission data and pagination
   */
  static async getSubmissions(axiosMiddleware: AxiosInstanceWrapper): Promise<ApiResponse<Submission>> {

    const page = DEFAULT_PAGE;
    const limit = DEFAULT_LIMIT;

    try {
      const configuredAxios = SubmissionService.configureAxiosInstance(axiosMiddleware);
      console.log(`API: GET ${getSubmissionsEndpoint}`);

      // Call API endpoint
      const response = await configuredAxios.get(getSubmissionsEndpoint);

      // Transform the response data if needed
      const transformedData = Array.isArray(response.data)
        ? response.data.map(transformSubmission)
        : [];

      // Debug: Log response headers to help troubleshoot pagination issues
      console.log(`API: Response headers: ${JSON.stringify(response.headers, null, JSON_INDENT)}`);

       // TODO: Pagination not currently implemented
      const paginationMeta = SubmissionService.extractPaginationMeta();


      console.log(`API: Returning ${transformedData.length} submissions`);

      return {
        data: transformedData,
        pagination: paginationMeta,
        status: 'success'
      };

    } catch (error) {
      const errorMessage = extractAndLogError(error, 'API error');

      return {
        data: [],
        pagination: { total: EMPTY_TOTAL, page, limit },
        status: 'error',
        message: errorMessage
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
      totalPages: undefined
    };
  }

  /**
   * Create configured axios instance with API credentials
   * @param {AxiosInstanceWrapper} axiosMiddleware - Axios middleware from request
   * @returns {AxiosInstanceWrapper} Configured axios instance
   */
  private static configureAxiosInstance(axiosMiddleware: AxiosInstanceWrapper): AxiosInstanceWrapper {
    // Override base URL and add API-specific headers
    const { axiosInstance } = axiosMiddleware;
    const { defaults } = axiosInstance;
    const { api: { baseUrl } } = config;

    // Safely configure axios defaults
    if (typeof baseUrl === 'string') {
      defaults.baseURL = baseUrl;
    }

    defaults.headers.common['Content-Type'] = 'application/json';
    defaults.headers.common.Accept = 'application/json';

    return axiosMiddleware;
  }
}

// Export the service
export const submissionsService = SubmissionService;
