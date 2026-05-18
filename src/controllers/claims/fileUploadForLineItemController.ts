import { createProcessedError } from '#src/helpers/errorHandler.js';
import { claimService } from '#src/services/claimService.js';
import { FileUploadForLineItemViewModel } from '#src/viewmodels/fileUploadForLineItemViewModel.js';
import type { Express, NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const NOT_FOUND = 404;
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

      const lineItems = [
        { id: 1, title: 'Bill Narrative' },
        { id: 2, title: 'Interim hearing on 20 December 2023' },
      ];

      const lineItem = lineItems.find((item) => item.id === lineItemId);

      if (lineItem === undefined) {
        res.status(NOT_FOUND).render('main/error.njk', {
          status: '404',
        });
        return;
      }

      const vm = new FileUploadForLineItemViewModel(claim, lineItem);

      res.render('main/claims/fileUploadForLineItemView.njk', {
        vm,
        csrfToken: res.locals.csrfToken,
      });
      return;
    }

    res.status(NOT_FOUND).render('main/error.njk', {
      status: '404',
    });
  } catch (error) {
    next(createProcessedError(error, 'fetching evidence upload details for user'));
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
export function uploadEvidenceFile(
  req: MulterRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { file } = req;

    if (file === undefined) {
      res.status(BAD_REQUEST).json({
        error: 'No file uploaded',
      });
      return;
    }

    res.json({
      success: {
        messageText: `${file.originalname} uploaded`,
        messageHtml: `
        <a href="#" class="govuk-link">${escapeHtml(file.originalname)}</a>
        <span class="govuk-!-margin-left-2">${formatFileSize(file.size)}</span>
        <strong class="govuk-tag govuk-tag--green govuk-!-margin-left-4">Uploaded</strong>
        `,
      },
      file: {
        filename: file.filename,
        originalname: file.originalname,
      },
    });
  } catch (error) {
    next(error);
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
        error: 'Missing file id',
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

function formatFileSize(sizeInBytes: number): string {
  const sizeInKilobytes = sizeInBytes / 1024;

  if (sizeInKilobytes < 1024) {
    return `${Math.max(1, Math.round(sizeInKilobytes))}KB`;
  }

  return `${Math.round(sizeInKilobytes / 1024)}MB`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}