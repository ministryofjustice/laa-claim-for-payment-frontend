import { claimService } from "#src/services/claimService.js";
import { FileUploadForLineItemViewModel } from "#src/viewmodels/fileUploadForLineItemViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import createHttpError from "http-errors";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { uploadService } from "#src/services/uploadService.js";

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

      const saveAndContinueHref = buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {
        claimId: claim.id,
      });
      const uploadUrl = buildRoute(ROUTES.AJAX_UPLOAD_FILE_FOR_LINE_ITEM, {
        claimId: claim.id,
        lineItemId: lineItem.id,
      });
      const deleteUrl = buildRoute(ROUTES.AJAX_DELETE_FILE_FOR_LINE_ITEM, {
        claimId: claim.id,
        lineItemId: lineItem.id,
      });

      const vm = new FileUploadForLineItemViewModel(claim, lineItem, uploadUrl, deleteUrl, saveAndContinueHref);

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
 * @param {Request} req Express request object containing the uploaded file.
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
      const response = await uploadService.linkEvidenceToLineItem(
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
