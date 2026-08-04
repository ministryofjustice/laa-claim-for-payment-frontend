import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  deleteEvidenceFromClaim as deleteEvidenceFromClaimApi,
  linkEvidenceToLineItem as linkEvidenceToLineItemApi,
  unlinkEvidenceFromLineItem as unlinkEvidenceFromLineItemApi,
  uploadClaimEvidence as uploadClaimEvidenceApi,
  uploadLineItemEvidence as uploadLineItemEvidenceApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type { AjaxUploadResponse, ApiResponse } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import config from "../../config.js";
import { escapeHtml } from "#src/helpers/escapehtml.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import type { UUID } from "uuidv7";
import type { Client } from "#src/generated/claim-api/client/index.js";
import type { ClaimStatus } from "#src/types/Claim.js";
import type { TFunction } from "#node_modules/i18next/index.js";

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
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {UUID[]} evidenceIds - Evidence identifiers.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async linkEvidenceToLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    evidenceIds: UUID[],
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
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        body: evidenceIds.map((evidenceId) => evidenceId.toString()),
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
   * @param {TFunction} t Translation function.
   * @param {ClaimStatus} claimStatus Claim status (DRAFT or SUBMITTED).
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<AjaxUploadResponse>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    file: Express.Multer.File,
    t: TFunction,
    claimStatus: ClaimStatus,
    deps: UploadServiceDeps = defaultDeps,
  ): Promise<AjaxUploadResponse> {
    try {
      const client = this.createApiClient(axiosMiddleware, deps);
      const response = await deps.uploadClaimEvidence({
        client,
        path: {
          claimId: claimId.toString(),
        },
        query: {
          status: claimStatus,
        },
        body: {
          documents: this.fileToUpload(file),
        },
      });

      if (response.data == null || response.data.type === "error") {
        return this.uploadError(t);
      }

      return this.uploadSuccess(file, t, response.data.evidenceId);
    } catch {
      return this.uploadError(t);
    }
  }

  /**
   * Uploads evidence for a claim line item and returns a response for the multi-file upload component.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {object} file Uploaded file from multer.
   * @param {TFunction} t Translation function.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<AjaxUploadResponse>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadLineItemEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    file: Express.Multer.File,
    t: TFunction,
    deps: UploadServiceDeps = defaultDeps,
  ): Promise<AjaxUploadResponse> {
    try {
      const client = this.createApiClient(axiosMiddleware, deps);

      const response = await deps.uploadLineItemEvidence({
        client,
        path: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        body: {
          documents: this.fileToUpload(file),
        },
      });

      if (response.data == null || response.data.type === "error") {
        return this.uploadError(t);
      }

      return this.uploadSuccess(file, t, response.data.evidenceId);
    } catch {
      return this.uploadError(t);
    }
  }

  /**
   * Unlink evidence from a line item.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {UUID} evidenceId - Evidence identifier.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async unlinkEvidenceFromLineItem(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    evidenceId: UUID,
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
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
          evidenceId: evidenceId.toString(),
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
   * @param {UUID} claimId Claim identifier.
   * @param {UUID} evidenceId Evidence identifier.
   * @param {ClaimStatus} claimStatus Claim status (DRAFT or SUBMITTED).
   * @param {UploadServiceDeps} deps Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async deleteEvidenceFromClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    evidenceId: UUID,
    claimStatus: ClaimStatus,
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
          claimId: claimId.toString(),
          evidenceId: evidenceId.toString(),
        },
        query: {
          status: claimStatus,
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
   * Get HTML for the summary list row for an uploaded file.
   * @param {TFunction} t translation function
   * @param {object} file file
   * @param {string} file.id file ID
   * @param {string} file.name file name
   * @param {string} file.size file size (pre-formatted)
   * @returns {string} HTML
   */
  static getUploadedFileRow(
    t: TFunction,
    file: {
      id: string;
      name: string;
      size: string;
    },
  ): string {
    return `
      <div class="govuk-summary-list__row moj-multi-file-upload__row">
        <dt class="govuk-summary-list__key moj-multi-file-upload__key">
          <a href="/evidence/${file.id}" class="govuk-link uploaded-file-name">
            ${file.name}
          </a>
        </dt>

        <dd class="govuk-summary-list__value moj-multi-file-upload__value">
          <span class="uploaded-file-size govuk-!-margin-left-2 govuk-!-margin-right-2">
            ${file.size}
          </span>

          <strong class="govuk-tag govuk-tag--green govuk-!-margin-left-4">
            ${t("common.fileUploadStatus.uploaded")}
          </strong>
        </dd>

        <dd class="govuk-summary-list__actions moj-multi-file-upload__actions">
          <button
            type="submit"
            name="delete"
            value="${file.id}"
            class="moj-multi-file-upload__delete govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-visually-hidden"
          >
            ${t("common.delete")}
            <span class="govuk-visually-hidden">
              ${file.name}
            </span>
          </button>

          <a href="#" class="govuk-link moj-multi-file-upload__delete-link">
            ${t("common.delete")}
            <span class="govuk-visually-hidden">
              ${file.name}
            </span>
          </a>
        </dd>
      </div>
    `;
  }

  /**
   * Get HTML for the summary list row for an uploading file.
   * @param {TFunction} t translation function
   * @param {object} file file
   * @param {string} file.name file name
   * @returns {string} HTML
   */
  static getUploadingFileRow(
    t: TFunction,
    file: {
      name: string;
    },
  ): string {
    return `
      <div class="govuk-summary-list__row govuk-summary-list__row--no-actions moj-multi-file-upload__row">
        <dt class="govuk-summary-list__key moj-multi-file-upload__key">
          <span class="uploaded-file-name">
            ${file.name}
          </span>
        </dt>

        <dd class="govuk-summary-list__value moj-multi-file-upload__value">
          <span class="moj-multi-file-upload__progress govuk-!-margin-left-2 govuk-!-margin-right-2">
            0%
          </span>

          <strong class="govuk-tag govuk-tag--yellow govuk-!-margin-left-4">
            ${t("common.fileUploadStatus.uploading")}
          </strong>
        </dd>
      </div>
    `;
  }

  /**
   * Get HTML for the summary list row for a failed upload.
   * @param {TFunction} t translation function
   * @param {object} file file
   * @param {string} file.name file name
   * @param {string} file.message error message
   * @returns {string} HTML
   */
  static getFailedFileRow(
    t: TFunction,
    file: {
      name: string;
      message: string;
    },
  ): string {
    return `
      <div class="govuk-summary-list__row govuk-summary-list__row--no-actions moj-multi-file-upload__row">
        <dt class="govuk-summary-list__key moj-multi-file-upload__key">
          ${file.name}
        </dt>

        <dd class="govuk-summary-list__value moj-multi-file-upload__value">
          <span class="moj-multi-file-upload__failed govuk-!-margin-left-2 govuk-!-margin-right-2">
            ${file.message}
          </span>

          <strong class="govuk-tag govuk-tag--red govuk-!-margin-left-4">
            ${t("common.fileUploadStatus.failed")}
          </strong>
        </dd>
      </div>
    `;
  }

  private static createApiClient(
    axiosMiddleware: AxiosInstanceWrapper,
    deps: UploadServiceDeps,
  ): Client {
    return deps.createClient({
      baseURL: config.api.baseUrl,
      axios: axiosMiddleware.axiosInstance,
      throwOnError: true,
    });
  }

  private static fileToUpload(file: Express.Multer.File): File {
    const arrayBuffer = new ArrayBuffer(file.buffer.byteLength);
    new Uint8Array(arrayBuffer).set(file.buffer);

    return new File([arrayBuffer], file.originalname, {
      type: file.mimetype,
    });
  }

  private static uploadSuccess(
    file: Express.Multer.File,
    t: TFunction,
    evidenceId: string,
  ): AjaxUploadResponse {
    return {
      status: "success",
      success: {
        messageText: t("multiFileUpload.uploadedMessage", {
          filename: file.originalname,
        }),
        messageHtml: `
          <span class="uploaded-file-row">
            <a href="#" class="govuk-link uploaded-file-name">${escapeHtml(file.originalname)}</a>
            <span class="uploaded-file-size govuk-!-margin-left-2">${formatFileSize(file.size)}</span>
            <strong class="govuk-tag govuk-tag--green govuk-!-margin-left-4">
              ${t("common.uploadStatus.uploaded")}
            </strong>
          </span>`,
      },
      file: {
        id: evidenceId,
        filename: file.originalname,
        originalname: file.originalname,
        size: formatFileSize(file.size),
      },
    };
  }

  private static uploadError(t: TFunction): AjaxUploadResponse {
    return {
      status: "error",
      error: {
        message: t("multiFileUpload.errors.uploadFailed"),
      },
    };
  }
}

export const uploadService = UploadService;
