import type { NextFunction, Response } from "express";
import { processError } from "#src/helpers/index.js";
import type { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
import { UUID } from "uuidv7";
import { ClaimStatus } from "#src/types/Claim.js";
import type { AjaxUploadResponse } from "#src/types/api-types.js";
const BAD_REQUEST = 400;

function validateUploadedFile(
  req: MulterRequest,
  res: Response,
): Express.Multer.File | undefined {
  const { file, t } = req;

  if (file === undefined) {
    const response: AjaxUploadResponse = {
      status: "error",
      error: {
        message: t("multiFileUpload.errors.noFileSelected"),
      },
    };
    res.status(BAD_REQUEST).json(response);
    return undefined;
  }

  if (file.size === 0) {
    const response: AjaxUploadResponse = {
      status: "error",
      error: {
        message: t("multiFileUpload.errors.emptyFile"),
      },
    };
    res.status(BAD_REQUEST).json(response);
    return undefined;
  }

  return file;
}

/**
 * Handles AJAX upload of evidence files for a claim
 *
 * @param {MulterRequest} req Express request object containing the uploaded file.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export async function uploadEvidenceFile(
  req: MulterRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      params: { claimId },
      query: { claimStatus },
      t,
      axiosMiddleware,
    } = req;

    const file = validateUploadedFile(req, res);

    if (file === undefined) {
      return;
    }

    if (!isClaimStatus(claimStatus)) {
      const response: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.invalidClaimStatus"),
        },
      };
      res.status(400).json(response);
      return;
    }

    const translations = {
      uploaded: t("common.uploadStatus.uploaded"),
      uploadedMessage: t("multiFileUpload.uploadedMessage", {
        filename: file.originalname,
      }),
    };

    const response = await uploadService.uploadEvidence(
      axiosMiddleware,
      UUID.parse(claimId),
      file,
      translations,
      claimStatus,
    );

    res.json(response);
  } catch (error) {
    next(processError(error, "uploading evidence file"));
  }
}

/**
 * Handles AJAX upload of evidence files for a claim line item.
 *
 * @param {MulterRequest} req Express request object containing the uploaded file.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export async function uploadEvidenceFileForLineItem(
  req: MulterRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      params: { claimId, lineItemId },
      t,
      axiosMiddleware,
    } = req;

    const file = validateUploadedFile(req, res);

    if (file === undefined) {
      return;
    }

    const translations = {
      uploaded: t("common.uploadStatus.uploaded"),
      uploadedMessage: t("multiFileUpload.uploadedMessage", {
        filename: file.originalname,
      }),
    };

    const response = await uploadService.uploadLineItemEvidence(
      axiosMiddleware,
      UUID.parse(claimId),
      UUID.parse(lineItemId),
      file,
      translations,
    );

    res.json(response);
  } catch (error) {
    next(processError(error, "uploading evidence file"));
  }
}

/**
 * Handles AJAX deletion of claim-level evidence files.
 *
 * @param {DeleteFileRequest} req Express request object containing the file delete request body.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {Promise<void>} Promise that resolves when the response has been sent.
 */
export async function deleteEvidenceFileFromClaim(
  req: DeleteFileRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      body: { delete: fileId },
      params: { claimId },
      query: { claimStatus },
      t,
      axiosMiddleware,
    } = req;

    if (fileId === "") {
      const response: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.missingFileId"),
        },
      };
      res.status(BAD_REQUEST).json(response);
      return;
    }

    if (!isClaimStatus(claimStatus)) {
      const response: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.invalidClaimStatus"),
        },
      };
      res.status(400).json(response);
      return;
    }

    const response = await uploadService.deleteEvidenceFromClaim(
      axiosMiddleware,
      UUID.parse(claimId),
      UUID.parse(fileId),
      claimStatus,
    );

    res.json(response);
  } catch (error) {
    next(processError(error, "deleting evidence file from claim"));
  }
}

/**
 * Handles AJAX deletion of uploaded evidence files.
 *
 * @param {DeleteFileRequest} req Express request object containing the file delete request body.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export async function unlinkEvidenceFileFromLineItem(
  req: DeleteFileRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      body: { delete: fileId },
      t,
      axiosMiddleware,
      params: { claimId, lineItemId },
    } = req;

    if (fileId === "") {
      const response: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.missingFileId"),
        },
      };
      res.status(BAD_REQUEST).json(response);
      return;
    }

    const response = await uploadService.unlinkEvidenceFromLineItem(
      axiosMiddleware,
      UUID.parse(claimId),
      UUID.parse(lineItemId),
      UUID.parse(fileId),
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
}

function isClaimStatus(value: unknown): value is ClaimStatus {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
  return Object.values(ClaimStatus).includes(value as ClaimStatus);
}
