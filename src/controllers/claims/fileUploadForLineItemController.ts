import { claimService } from "#src/services/claimService.js";
import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import createHttpError from "http-errors";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";

const BAD_REQUEST = 400;

/**
 * File upload page for Bill narrative.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {Promise<void>} Page to be returned.
 */
export async function fileUploadForLineItemPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const lineItemId = Number(req.params.lineItemId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response;
      const { lineItems } = claim;

      const lineItem = lineItems?.find((item) => item.id === lineItemId);

      if (lineItem === undefined) {
        next(new createHttpError.NotFound(`Line item ${lineItemId} not found`));
        return;
      }

      const vm = new FileUploadForLineItemViewModel(claim, lineItem);

      res.render("main/claims/fileUploadForLineItemView.njk", {
        vm,
        csrfToken: res.locals.csrfToken,
      });
      return;
    }

    next(
      processApiError(response, "fetching evidence upload details for user"),
    );
  } catch (error) {
    next(processError(error, "fetching evidence upload details for user"));
  }
}

/**
 * Handles linking of evidence files for a claim line item.
 *
 * @param {MulterRequest} req Express request object containing the uploaded file.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export async function linkEvidenceToLineItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const lineItemId = Number(req.params.lineItemId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const documents: unknown = req.body?.documents;

    const evidenceIds: number[] = Array.isArray(documents)
      ? documents
          .filter((id): id is string => typeof id === "string")
          .map((id) => id.trim())
          .filter(Boolean)
          .map(Number)
      : [];

    if (evidenceIds.length > 0) {
      const response = await claimService.linkEvidenceToLineItem(
        req.axiosMiddleware,
        claimId,
        lineItemId,
        evidenceIds,
      );
      if (response.status === "error") {
        next(processApiError(response, "linking evidence to line item"));
        return;
      }
    }
    const redirectUrl = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
      claimId,
    });
    res.redirect(redirectUrl);
  } catch (error) {
    next(processError(error, "linking evidence to line item"));
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

    const response = await claimService.uploadLineItemEvidence(
      req.axiosMiddleware,
      Number(req.params.claimId),
      Number(req.params.lineItemId),
      file,
      translations,
    );

    res.json(response);
  } catch (error) {
    next(processError(error, "uploading evidence file"));
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
export async function deleteEvidenceFile(
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

    const response = await claimService.unlinkEvidenceFromLineItem(
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

/**
 * Handles the continue action after uploading evidence files.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export function continueFromFileUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

    res.redirect(`/claims/${claimId}`);
  } catch (error) {
    next(error);
  }
}
