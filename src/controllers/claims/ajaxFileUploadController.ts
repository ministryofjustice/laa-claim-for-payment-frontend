import type { NextFunction, Response } from "express";
import { processError } from "#src/helpers/index.js";
import type { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
const BAD_REQUEST = 400;

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
    const { file } = req;

    if (file === undefined) {
      res.status(BAD_REQUEST).json({
        error: {
          message: req.t("multiFileUpload.errors.noFileUploaded"),
        },
      });
      return;
    }

    const translations = {
      uploaded: req.t("common.uploadStatus.uploaded"),
      uploadedMessage: req.t("multiFileUpload.uploadedMessage", {
        filename: file.originalname,
      }),
    };

    const response = await uploadService.uploadEvidence(
      req.axiosMiddleware,
      Number(req.params.claimId),
      file,
      translations,
    );

    res.json(response.body);
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
    const { file } = req;

    if (file === undefined) {
      res.status(BAD_REQUEST).json({
        error: {
          message: req.t("multiFileUpload.errors.noFileUploaded"),
        },
      });
      return;
    }

    const translations = {
      uploaded: req.t("common.uploadStatus.uploaded"),
      uploadedMessage: req.t("multiFileUpload.uploadedMessage", {
        filename: file.originalname,
      }),
    };

    const response = await uploadService.uploadLineItemEvidence(
      req.axiosMiddleware,
      Number(req.params.claimId),
      Number(req.params.lineItemId),
      file,
      translations,
    );

    res.json(response.body);
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
      axiosMiddleware,
    } = req;

    if (fileId === "") {
      res.status(BAD_REQUEST).json({
        error: {
          message: req.t("multiFileUpload.errors.missingFileId"),
        },
      });
      return;
    }

    const response = await uploadService.deleteEvidenceFromClaim(
      axiosMiddleware,
      Number(claimId),
      Number(fileId),
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
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- Using alias because "delete" is a reserved keyword.
    const { delete: fileId } = req.body;
    if (fileId === "") {
      res.status(BAD_REQUEST).json({
        error: {
          message: req.t("multiFileUpload.errors.missingFileId"),
        },
      });
      return;
    }

    const response = await uploadService.unlinkEvidenceFromLineItem(
      req.axiosMiddleware,
      Number(req.params.claimId),
      Number(req.params.lineItemId),
      Number(fileId),
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
}
