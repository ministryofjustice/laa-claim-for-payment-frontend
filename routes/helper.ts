import type { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import multer from 'multer';
import type { MulterRequest } from "#src/types/requests.js";

export const ROUTES = {
  CLAIMS: '/',
  CHOOSE_UPLOAD: '/claims/:claimId/choose-upload',
  UPLOAD_EVIDENCE_INDIVIDUALLY: '/claims/:claimId/upload-evidence-individually',
  UPLOAD_FILE_FOR_LINE_ITEM: '/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload',
  VIEW_CLAIM: '/claims/:claimId',
  HOW_MANY_CLIENTS_RETAINED: '/claims/:claimId/how-many-clients-retained',
  HOW_MANY_CLIENTS_AT_START_OF_CASE: '/claims/:claimId/how-many-clients-at-start-of-case',
  POA_CLAIM_TYPE: '/claims/:claimId/poa/claim-type',
  PROFIT_COST_DETAILS: '/claims/:claimId/poa/profit-cost-details',
  EXPERT_COST_DETAILS: '/claims/:claimId/poa/expert-cost-details',
  NON_EXPERT_COST_DETAILS: '/claims/:claimId/poa/non-expert-disbursement',
} as const;

/**
 * Builds a route by replacing named parameters with encoded values.
 *
 * @param {string} route The route pattern containing named parameters.
 * @param {Record<string, string | number>} params The parameter values to insert into the route.
 * @returns {string} The route with parameters replaced.
 */
export function buildRoute(
  route: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) =>
      path.replace(`:${key}`, encodeURIComponent(String(value))),
    route
  );
}

/**
 * Handles multer upload validation and file upload errors.
 *
 * @param {Error} error The error thrown by multer or custom upload validation.
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next middleware function.
 * @returns {void}
 */
export function multerErrorHandler(
  error: Error,
  req: MulterRequest,
  res: Response,
  next: NextFunction,
): void {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      error: {
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? req.t("multiFileUpload.errors.fileTooLarge")
            : error.message,
      },
    });
    return;
  }

  if (error instanceof HttpError && error.statusCode === 415) {
    res.status(400).json({
      error: {
        message: req.t('multiFileUpload.errors.onlyPdf'),
      },
    });
    return;
  }

  next(error);
}
