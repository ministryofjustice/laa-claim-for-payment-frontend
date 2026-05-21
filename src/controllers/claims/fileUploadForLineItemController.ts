import { claimService } from '#src/services/claimService.js';
import { FileUploadForLineItemViewModel } from '#src/viewmodels/fileUploadForLineItemViewModel.js';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { processApiError, processError } from "#src/helpers/index.js";
import createHttpError from "http-errors";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { uploadLineItemEvidence } from '#src/services/evidenceUploadService.js';

const BAD_REQUEST = 400;
const OK = 200;

export const uploadDir = path.resolve('tmp/uploads');

type MulterRequest = Request & {
  file?: Express.Multer.File;
};

type DeleteFileRequest = Request<Record<string, string>, unknown, { delete?: string }>;

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

    if (response.status === 'success') {
      const { body: claim } = response;
      const {lineItems} = claim;

      const lineItem = lineItems?.find((item) => item.id === lineItemId);

      if (lineItem === undefined) {
        next(new createHttpError.NotFound(`Line item ${lineItemId} not found`));
        return;
      }

      const vm = new FileUploadForLineItemViewModel(claim, lineItem);

      res.render('main/claims/fileUploadForLineItemView.njk', {
        vm,
        csrfToken: res.locals.csrfToken,
      });
      return;
    }

    next(processApiError(response, 'fetching evidence upload details for user'));
  } catch (error) {
    next(processError(error, 'fetching evidence upload details for user'));
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
    const evidenceIds: number[] = ([] as string[])
      .concat(req.body?.documents ?? [])
      .map(String)
      .map(id => id.trim())
      .filter(Boolean)
      .map(Number);
    // TODO - if evidence IDs is empty, skip
    await claimService.linkEvidenceToLineItem(req.axiosMiddleware, claimId, lineItemId, evidenceIds);
    const redirectUrl = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
      claimId: claimId,
    });
    res.redirect(redirectUrl);
  } catch (error) {
    next(processError(error, ""));
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
        error: { message: 'No file uploaded' },
      });
      return;
    }

    const response = await uploadLineItemEvidence({
      axiosMiddleware: req.axiosMiddleware,
      claimId: Number(req.params.claimId),
      lineItemId: Number(req.params.lineItemId),
      file,
    });

    res.json(response);
  } catch (error) {
    next(processError(error, 'uploading evidence file'));
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
export function deleteEvidenceFile(
  req: DeleteFileRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- Using alias because "delete" is a reserved keyword.
    const { delete: fileId } = req.body;
    
    if (fileId === undefined || fileId === '') {
      res.status(BAD_REQUEST).json({
        error: {message: 'Missing file id'},
      });
      return;
    }

    const filePath = path.resolve(uploadDir, fileId);

    if (!filePath.startsWith(uploadDir)) {
      res.status(BAD_REQUEST).json({
        error: 'Invalid file path',
      });
      return;
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(OK).json({
      success: true,
    });
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
