import type { NextFunction, Response } from "express";
import { HttpError } from "http-errors";
import multer from "multer";
import type { MulterRequest } from "#src/types/requests.js";
import type { UUID } from "uuidv7";
import type { AjaxUploadError } from "#src/types/api-types.js";

export const ROUTES = {
  INDEX: "/",
  VIEW_CLAIM: "/claims/:claimId",
  AJAX_GET_FILE_ROW: "/evidence-upload/ajax-get-file-row",

  LINE_ITEM_UPLOAD: {
    CHOOSE_UPLOAD: "/claims/:claimId/choose-upload",
    UPLOAD_EVIDENCE_INDIVIDUALLY:
      "/claims/:claimId/upload-evidence-individually",
    FILE_UPLOAD:
      "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload",
    AJAX_UPLOAD:
      "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload/ajax-upload",
    AJAX_DELETE:
      "/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload/ajax-delete",
  },

  POA: {
    CLAIM_TYPE: "/claims/:claimId/poa/claim-type",

    PROFIT_COST: {
      HOW_MANY_CLIENTS_RETAINED:
        "/claims/:claimId/poa/how-many-clients-retained",
      DETAILS: "/claims/:claimId/poa/profit-cost-details",
      MULTIPLE_CLIENT_HEARINGS:
        "/claims/:claimId/poa/multiple-client-hearings",
      ESCAPING_FIXED_FEE:
        "/claims/:claimId/poa/escaping-standard-fixed-fee",
      NUMBER_OF_CLIENTS_START_OF_CASE:
        "/claims/:claimId/poa/number-of-clients-start-of-case",
      CPGFS_BILL_LINE:
        "/claims/:claimId/poa/cpgfs-profit-cost-bill-line",
    },

    DISBURSEMENTS: {
      DETAILS: "/claims/:claimId/poa/disbursement-details",
      ADD: "/claims/:claimId/poa/disbursement-details/add",
      REMOVE:
        "/claims/:claimId/poa/disbursement-details/:lineItemId/remove",
    },

    EVIDENCE_UPLOAD: "/claims/:claimId/poa/evidence-upload",
    AJAX_UPLOAD_EVIDENCE:
      "/claims/:claimId/poa/evidence-upload/ajax-upload",
    AJAX_DELETE_EVIDENCE:
      "/claims/:claimId/poa/evidence-upload/ajax-delete",

    CHECK_DETAILS: "/claims/:claimId/poa/check-details",
    SUBMISSION_SUCCESSFUL: "/claims/:claimId/poa-submitted",
  },
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