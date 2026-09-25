import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import type { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
import { UUID } from "uuidv7";
import type {
  AjaxUploadResponse,
  AjaxUploadSuccess,
} from "#src/types/api-types.js";
import { ClaimStatus } from "#src/types/Claim.js";
import { isEnumValue } from "#src/helpers/queryParsers.js";
import nunjucks from "nunjucks";
import type { TFunction } from "#node_modules/i18next/index.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { UploadSuccess } from "#src/generated/claim-api/index.js";

const BAD_REQUEST = 400;

function validateUploadedFile(
  req: MulterRequest,
  res: Response,
): Express.Multer.File | undefined {
  const { file, t } = req;

  if (file === undefined) {
    const body: AjaxUploadResponse = {
      status: "error",
      error: {
        message: t("multiFileUpload.errors.noFileSelected"),
      },
    };
    res.status(BAD_REQUEST).json(body);
    return undefined;
  }

  if (file.size === 0) {
    const body: AjaxUploadResponse = {
      status: "error",
      error: {
        message: t("multiFileUpload.errors.emptyFile"),
      },
    };
    res.status(BAD_REQUEST).json(body);
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
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.invalidClaimStatus"),
        },
      };
      res.status(400).json(body);
      return;
    }

    const response = await uploadService.uploadEvidence(
      axiosMiddleware,
      UUID.parse(claimId),
      file,
      claimStatus,
    );

    if (response.status === "error") {
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.uploadFailed"),
        },
      };
      res.status(500).json(body);
      return;
    }

    const body: AjaxUploadSuccess = getSuccessfulUploadJson(t, response.body, file);

    res.json(body);
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

    const response = await uploadService.uploadLineItemEvidence(
      axiosMiddleware,
      UUID.parse(claimId),
      UUID.parse(lineItemId),
      file,
    );

    if (response.status === "error") {
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.uploadFailed"),
        },
      };
      res.status(500).json(body);
      return;
    }

    const body: AjaxUploadSuccess = getSuccessfulUploadJson(t, response.body, file);

    res.json(body);
  } catch (error) {
    next(processError(error, "uploading evidence file"));
  }
}

function getSuccessfulUploadJson(
  t: TFunction,
  response: UploadSuccess,
  file: Express.Multer.File,
): AjaxUploadSuccess {
  const document: ReusableDocument = {
    id: response.evidenceId,
    name: file.originalname,
    size: formatFileSize(file.size),
  };
  const messageHtml = nunjucks.render("components/defaultUploadRow.njk", {
    t,
    file: document,
  });
  return {
    status: "success",
    success: {
      messageText: t("multiFileUpload.uploadedMessage", {
        filename: file.originalname,
      }),
      messageHtml,
    },
    file: document,
  };
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

    if (response.status === "error") {
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.deleteFailed"),
        },
      };
      res.status(500).json(body);
      return;
    }

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
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.missingFileId"),
        },
      };
      res.status(BAD_REQUEST).json(body);
      return;
    }

    const response = await uploadService.unlinkEvidenceFromLineItem(
      axiosMiddleware,
      UUID.parse(claimId),
      UUID.parse(lineItemId),
      UUID.parse(fileId),
    );

    if (response.status === "error") {
      const body: AjaxUploadResponse = {
        status: "error",
        error: {
          message: t("multiFileUpload.errors.deleteFailed"),
        },
      };
      res.status(500).json(body);
      return;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles AJAX updates of uploaded evidence file rows.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export function getFileRow(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const {
      query: { status },
    } = req;

    res.render("components/uploadRow.njk", {
      status,
      file: {
        id: req.query.fileId,
        name: req.query.fileName,
        size: req.query.fileSize,
        message: req.query.message,
      },
    });
  } catch (error) {
    next(error);
  }
}

function isClaimStatus(value: unknown): value is ClaimStatus {
  return isEnumValue(ClaimStatus, value);
}
