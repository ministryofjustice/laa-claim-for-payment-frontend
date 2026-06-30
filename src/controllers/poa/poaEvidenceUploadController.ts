import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";
import type { NextFunction, Request, Response } from "express";

/**
 * Display POA evidence upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function poaEvidenceUploadPage(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

    const vm = new PoaEvidenceUploadViewModel({
      uploadUrl: buildRoute(ROUTES.AJAX_UPLOAD_POA_EVIDENCE, { claimId }),
      deleteUrl: buildRoute(ROUTES.AJAX_DELETE_POA_EVIDENCE, { claimId }),
      saveAndContinueHref: buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, { claimId }),
      saveAndComeBackLaterHref: "#",
    });

    res.render("main/poa/poaEvidenceUploadView.njk", {
      csrfToken: res.locals.csrfToken,
      vm,
    });
  } catch (error) {
    next(processError(error, "rendering POA evidence upload page"));
  }
}

/**
 * Submit POA evidence upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function submitPoaEvidenceUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

    res.redirect(
      buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting POA evidence upload page"));
  }
}