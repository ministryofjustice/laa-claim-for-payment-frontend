import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  uploadClaimEvidence as uploadClaimEvidenceApi,
  deleteEvidenceFromClaim as deleteEvidenceFromClaimApi,
  linkEvidenceToLineItem as linkEvidenceToLineItemApi,
  unlinkEvidenceFromLineItem as unlinkEvidenceFromLineItemApi,
  uploadLineItemEvidence as uploadLineItemEvidenceApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type {
  AjaxUploadResponse,
  ApiResponse,
} from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import config from "../../config.js";
import { escapeHtml } from "#src/helpers/escapehtml.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";

interface UploadServiceDeps {
  createClient: typeof createClient;
  linkEvidenceToLineItem: typeof linkEvidenceToLineItemApi;
  uploadClaimEvidence: typeof uploadClaimEvidenceApi;
  deleteEvidenceFromClaim: typeof deleteEvidenceFromClaimApi;
  uploadLineItemEvidence: typeof uploadLineItemEvidenceApi;
  unlinkEvidenceFromLineItem: typeof unlinkEvidenceFromLineItemApi;
}

const defaultDeps: UploadServiceDeps = {
  createClient,
  linkEvidenceToLineItem: linkEvidenceToLineItemApi,
  uploadClaimEvidence: uploadClaimEvidenceApi,
  deleteEvidenceFromClaim: deleteEvidenceFromClaimApi,
  uploadLineItemEvidence: uploadLineItemEvidenceApi,
  unlinkEvidenceFromLineItem: unlinkEvidenceFromLineItemApi,
};

/**
 *
 */
class UploadService {
  
  /**
   * Link an array of evidence IDs to the given line item ID.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {number} claimId - Claim identifier.
   * @param {number} lineItemId - Line item identifier.
   * @param {number[]} evidenceIds - Evidence identifiers.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async linkEvidenceToLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    lineItemId: number,
    evidenceIds: number[],
    deps: UploadServiceDeps = defaultDeps,
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
   * Uploads evidence for a claim and returns a response for the multi-file upload component.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {number} claimId - Claim identifier.
   * @param {object} file Uploaded file from multer.
   * @param {object} translations Translations.
   * @param {string} translations.uploaded Translation for uploaded message.
   * @param {string} translations.uploadedMessage Translation for uploadedMessage message.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<AjaxUploadResponse>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    file: Express.Multer.File,
    translations: {
      uploaded: string;
      uploadedMessage: string;
    },
    deps: UploadServiceDeps = defaultDeps,
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

      const response = await deps.uploadClaimEvidence({
        client: apiClient,
        path: {
          claimId,
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
   * Uploads evidence for a claim line item and returns a response for the multi-file upload component.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.   
   * @param {number} claimId - Claim identifier.
   * @param {number} lineItemId - Line item identifier.
   * @param {object} file Uploaded file from multer.
   * @param {object} translations Translations.
   * @param {string} translations.uploaded Translation for uploaded message.
   * @param {string} translations.uploadedMessage Translation for uploadedMessage message.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
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
    deps: UploadServiceDeps = defaultDeps,
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
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async unlinkEvidenceFromLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: number,
    lineItemId: number,
    evidenceId: number,
    deps: UploadServiceDeps = defaultDeps,
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

 /**
  * Delete evidence from a claim.
  *
  * @param {AxiosInstanceWrapper} axiosMiddleware Wrapped Axios client from request middleware.
  * @param {number} claimId Claim identifier.
  * @param {number} evidenceId Evidence identifier.
  * @param {UploadServiceDeps} deps Service dependencies used to create the client and call the generated API.
  * @returns {Promise<ApiResponse<null>>} Null response in app response format.
  */
  static async deleteEvidenceFromClaim(
  axiosMiddleware: AxiosInstanceWrapper,
  claimId: number,
  evidenceId: number,
  deps: UploadServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    try {
      const apiClient = deps.createClient({
        baseURL: config.api.baseUrl,
        axios: axiosMiddleware.axiosInstance,
        throwOnError: true,
      });

      await deps.deleteEvidenceFromClaim({
        client: apiClient,
        path: {
          claimId,
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

export const uploadService = UploadService;