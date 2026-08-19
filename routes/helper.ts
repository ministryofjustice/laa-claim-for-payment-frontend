import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import multer from "multer";
import type { MulterRequest } from "#src/types/requests.js";
import type { UUID } from "uuidv7";
import type { AjaxUploadError } from "#src/types/api-types.js";

export const ROUTES = {
  CLAIMS: "/",
  CHOOSE_UPLOAD: "/claims/:claimId/choose-upload", // lineItemUploadEnabled
  UPLOAD_EVIDENCE_INDIVIDUALLY: "/claims/:claimId/upload-evidence-individually", // lineItemUploadEnabled
  UPLOAD_FILE_FOR_LINE_ITEM: "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload", // lineItemUploadEnabled
  AJAX_UPLOAD_FILE_FOR_LINE_ITEM: "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload/ajax-upload", // lineItemUploadEnabled
  AJAX_DELETE_FILE_FOR_LINE_ITEM: "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload/ajax-delete", // lineItemUploadEnabled
  VIEW_CLAIM: "/claims/:claimId",
  HOW_MANY_CLIENTS_RETAINED: "/claims/:claimId/poa/how-many-clients-retained", // POA PC 
  POA_CLAIM_TYPE: "/claims/:claimId/poa/claim-type",
  PROFIT_COST_DETAILS: "/claims/:claimId/poa/profit-cost-details", // POA PC
  EXPERT_COST_DETAILS: "/claims/:claimId/poa/expert-cost-details",
  REMOVE_EXPERT_COST_DETAILS: "/claims/:claimId/poa/expert-cost-details/:lineItemId/remove",
  ADD_ANOTHER_EXPERT_COST_DETAILS: "/claims/:claimId/poa/expert-cost-details/add",
  NON_EXPERT_COST_DETAILS: "/claims/:claimId/poa/non-expert-disbursement",
  MULTIPLE_CLIENT_HEARINGS: "/claims/:claimId/poa/multiple-client-hearings", // POA PC
  ESCAPING_FIXED_FEE: "/claims/:claimId/poa/escaping-standard-fixed-fee", // POA PC
  NUMBER_OF_CLIENTS_START_OF_CASE: "/claims/:claimId/poa/number-of-clients-start-of-case", // POA PC
  POA_CHECK_YOUR_DETAILS: "/claims/:claimId/poa/check-details",
  POA_SUBMISSION_SUCCESSFUL: "/claims/:claimId/poa-submitted",
  CPGFS_PROFIT_COST_BILL_LINE: "/claims/:claimId/poa/cpgfs-profit-cost-bill-line", // POA PC
  POA_EVIDENCE_UPLOAD: "/claims/:claimId/poa/evidence-upload",
  AJAX_UPLOAD_POA_EVIDENCE: "/claims/:claimId/poa/evidence-upload/ajax-upload",
  AJAX_DELETE_POA_EVIDENCE: "/claims/:claimId/poa/evidence-upload/ajax-delete",
  AJAX_GET_FILE_ROW: "/evidence-upload/ajax-get-file-row",
} as const;

/**
 * Builds a route by replacing named parameters with encoded values.
 *
 * @param {string} route The route pattern containing named parameters.
 * @param {Record<string, string | number>} params The path parameter values to insert into the route.
 * @param {Record<string, string | number>} query The query parameter values to insert into the route.
 * @returns {string} The route with parameters replaced.
 */
export function buildRoute(
  route: string,
  params: Record<string, string | number | UUID>,
  query?: Record<string, string | number | UUID>,
): string {
  let path = route;

  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(String(value)));
  }

  if (query == null || Object.keys(query).length === 0) {
    return path;
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    searchParams.set(key, String(value));
  }

  return `${path}?${searchParams.toString()}`;
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
    const response: AjaxUploadError = {
      status: "error",
      error: {
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? req.t("multiFileUpload.errors.fileTooLarge")
            : error.message,
      },
    };
    res.status(400).json(response);
    return;
  }

  if (error instanceof HttpError && error.statusCode === 415) {
    const response: AjaxUploadError = {
      status: "error",
      error: {
        message: req.t("multiFileUpload.errors.onlyPdf"),
      },
    };
    res.status(400).json(response);
    return;
  }

  next(error);
}

/**
 * Registers the route if enabled
 *
 * @param {boolean} enabled the enebaled flag, provided from config
 * @param {() => void} register the route to register
 * @returns {void}
 */
export function registerIf(
  enabled: boolean,
  register: () => void,
): void {
  if (enabled) {
    register();
  }
}