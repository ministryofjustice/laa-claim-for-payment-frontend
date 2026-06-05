import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  getClaim as getClaimApi,
  getClaims as getClaimsApi,
  linkEvidenceToLineItem as linkEvidenceToLineItemApi,
  unlinkEvidenceFromLineItem as unlinkEvidenceFromLineItemApi,
  uploadLineItemEvidence as uploadLineItemEvidenceApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type {
  AjaxUploadResponse,
  ApiResponse,
  Paginated,
} from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import {
  type Claim,
  ClaimResponseSchema,
  ClaimsResponseSchema,
} from "#src/types/Claim.js";
import config from "../../config.js";
import { escapeHtml } from "#src/helpers/escapehtml.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

interface ClaimServiceDeps {
  createClient: typeof createClient;
  getClaims: typeof getClaimsApi;
  getClaim: typeof getClaimApi;
  linkEvidenceToLineItem: typeof linkEvidenceToLineItemApi;
  uploadLineItemEvidence: typeof uploadLineItemEvidenceApi;
  unlinkEvidenceFromLineItem: typeof unlinkEvidenceFromLineItemApi;
}

const defaultDeps: ClaimServiceDeps = {
  createClient,
  getClaims: getClaimsApi,
  getClaim: getClaimApi,
  linkEvidenceToLineItem: linkEvidenceToLineItemApi,
  uploadLineItemEvidence: uploadLineItemEvidenceApi,
  unlinkEvidenceFromLineItem: unlinkEvidenceFromLineItemApi,
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

      console.log("******");
      console.log(response.data);

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

      console.log("******");
      console.log(response.data);
      console.log(response.data?.lineItems);

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
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
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

  /**
   * Uploads evidence for a claim line item and returns a response for the multi-file upload component.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.   * @param {number} claimId Claim ID.
   * @param {number} claimId - Claim identifier.
   * @param {number} lineItemId - Line item identifier.
   * @param {object} file Uploaded file from multer.
   * @param {object} translations Translations.
   * @param {string} translations.uploaded Translation for uploaded message.
   * @param {string} translations.uploadedMessage Translation for uploadedMessage message.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<AjaxUploadResponse>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadLineItemEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    lineItemId: number,
    file: Express.Multer.File,
    translations: {
      uploaded: string;
      uploadedMessage: string;
    },
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<AjaxUploadResponse>> {
    try {
      const apiClient = deps.createClient({
        baseURL: config.api.baseUrl,
        axios: axiosMiddleware.axiosInstance,
        throwOnError: true,
      });

      const arrayBuffer = new ArrayBuffer(file.buffer.byteLength);
      const view = new Uint8Array(arrayBuffer);

      view.set(file.buffer);

      const response = await deps.uploadLineItemEvidence({
        client: apiClient,
        path: {
          claimId,
          lineItemId,
        },
        body: {
          documents: new File([arrayBuffer], file.originalname, {
            type: file.mimetype,
          }),
        },
      });

      if (response.data == null) {
        return createApiError(response.error);
      }

      if (response.data.type === "error") {
        return createApiError(response.data);
      }

      return {
        status: "success",
        body: {
          success: {
            messageText: translations.uploadedMessage,
            messageHtml: `
              <span class="uploaded-file-row">
                <a href="#" class="govuk-link uploaded-file-name">${escapeHtml(file.originalname)}</a>
                <span class="uploaded-file-size govuk-!-margin-left-2">${formatFileSize(file.size)}</span>
                <strong class="govuk-tag govuk-tag--green govuk-!-margin-left-4">
                  ${translations.uploaded}
                </strong>
              </span>`,
          },
          file: {
            filename: String(response.data.evidenceId),
            originalname: file.originalname,
          },
        },
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Unlink evidence from a line item.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.   * @param {number} claimId Claim ID.
   * @param {number} claimId - Claim identifier.
   * @param {number} lineItemId - Line item identifier.
   * @param {number} evidenceId - Evidence identifier.
   * @param {ClaimServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async unlinkEvidenceFromLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    lineItemId: number,
    evidenceId: number,
    deps: ClaimServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    try {
      const apiClient = deps.createClient({
        baseURL: config.api.baseUrl,
        axios: axiosMiddleware.axiosInstance,
        throwOnError: true,
      });

      await deps.unlinkEvidenceFromLineItem({
        client: apiClient,
        path: {
          claimId,
          lineItemId,
          evidenceId,
        },
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