import { createClient } from "#src/generated/claim-api/client/client.gen.js";
import {
  deleteAllEvidenceFromClaim as deleteAllEvidenceFromClaimApi,
  deleteEvidenceFromClaim as deleteEvidenceFromClaimApi,
  linkEvidenceToLineItem as linkEvidenceToLineItemApi,
  unlinkEvidenceFromLineItem as unlinkEvidenceFromLineItemApi,
  uploadClaimEvidence as uploadClaimEvidenceApi,
  uploadLineItemEvidence as uploadLineItemEvidenceApi,
} from "#src/generated/claim-api/sdk.gen.js";
import { createApiError } from "#src/helpers/index.js";
import type { ApiResponse } from "#src/types/api-types.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";
import config from "../../config.js";
import type { UUID } from "uuidv7";
import type { Client } from "#src/generated/claim-api/client/index.js";
import type { ClaimStatus } from "#src/types/Claim.js";
import type { UploadSuccess } from "#src/generated/claim-api/index.js";

interface UploadServiceDeps {
  createClient: typeof createClient;
  linkEvidenceToLineItem: typeof linkEvidenceToLineItemApi;
  uploadClaimEvidence: typeof uploadClaimEvidenceApi;
  deleteEvidenceFromClaim: typeof deleteEvidenceFromClaimApi;
  deleteAllEvidenceFromClaim: typeof deleteAllEvidenceFromClaimApi;
  uploadLineItemEvidence: typeof uploadLineItemEvidenceApi;
  unlinkEvidenceFromLineItem: typeof unlinkEvidenceFromLineItemApi;
}

const defaultDeps: UploadServiceDeps = {
  createClient,
  linkEvidenceToLineItem: linkEvidenceToLineItemApi,
  uploadClaimEvidence: uploadClaimEvidenceApi,
  deleteEvidenceFromClaim: deleteEvidenceFromClaimApi,
  deleteAllEvidenceFromClaim: deleteAllEvidenceFromClaimApi,
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
   * @param {ClaimStatus} claimStatus Claim status (DRAFT or SUBMITTED).
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<UploadSuccess>>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    file: Express.Multer.File,
    claimStatus: ClaimStatus,
    deps: UploadServiceDeps = defaultDeps,
  ): Promise<ApiResponse<UploadSuccess>> {
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
        return createApiError(new Error("Upload response data is empty"));
      }

      return {
        body: response.data,
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
    }
  }

  /**
   * Uploads evidence for a claim line item and returns a response for the multi-file upload component.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware - Wrapped Axios client from request middleware.
   * @param {UUID} claimId - Claim identifier.
   * @param {UUID} lineItemId - Line item identifier.
   * @param {object} file Uploaded file from multer.
   * @param {UploadServiceDeps} deps - Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<UploadSuccess>>} Upload response for the multi-file upload component.
   */
  // eslint-disable-next-line @typescript-eslint/max-params -- ignore
  static async uploadLineItemEvidence(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    lineItemId: UUID,
    file: Express.Multer.File,
    deps: UploadServiceDeps = defaultDeps,
  ): Promise<ApiResponse<UploadSuccess>> {
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
        return createApiError(new Error("Upload response data is empty"));
      }

      return {
        body: response.data,
        status: "success",
      };
    } catch (error) {
      return createApiError(error);
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
   * Delete all evidence from a claim.
   *
   * @param {AxiosInstanceWrapper} axiosMiddleware Wrapped Axios client from request middleware.
   * @param {UUID} claimId Claim identifier.
   * @param {ClaimStatus} claimStatus Claim status (DRAFT or SUBMITTED).
   * @param {UploadServiceDeps} deps Service dependencies used to create the client and call the generated API.
   * @returns {Promise<ApiResponse<null>>} Null response in app response format.
   */
  static async deleteAllEvidenceFromClaim(
    axiosMiddleware: AxiosInstanceWrapper,
    claimId: UUID,
    claimStatus: ClaimStatus,
    deps: UploadServiceDeps = defaultDeps,
  ): Promise<ApiResponse<null>> {
    try {
      const apiClient = deps.createClient({
        baseURL: config.api.baseUrl,
        axios: axiosMiddleware.axiosInstance,
        throwOnError: true,
      });

      await deps.deleteAllEvidenceFromClaim({
        client: apiClient,
        path: {
          claimId: claimId.toString(),
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
}

export const uploadService = UploadService;
