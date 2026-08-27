import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { AnswerMissingError } from "#src/types/errors.js";
import { requireClaim } from "#src/helpers/requireClaim.js";

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function checkYourDetailsPage(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const vm = new CheckDetailsViewModel(claim);
    res.render("main/poa/checkDetailsView.njk", { vm });
  } catch (error) {
    if (error instanceof AnswerMissingError) {
      res.redirect(error.urlToRedirectTo);
    }
    next(processError(error, `fetching claim details for user`));
  }
}

/**
 * Submit answers
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function submitYourDetails(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    // TODO submit the data
    res.redirect(buildRoute(ROUTES.POA.SUBMISSION_SUCCESSFUL, { claimId }));
  } catch (error) {
    const processedError = processError(
      error,
      "submitting answers"
    );
    next(processedError);
  }
}
