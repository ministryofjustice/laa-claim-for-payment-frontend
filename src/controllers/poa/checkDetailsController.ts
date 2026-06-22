import { claimService } from "#src/services/claimService.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";
import { ROUTES } from "#routes/helper.js";

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function checkYourDetailsPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response;
      const vm = new CheckDetailsViewModel(claim);

      res.render("main/poa/checkDetailsView.njk", { vm });
    } else {
      next(processApiError(response, `fetching claim details for user`));
    }
  } catch (error) {
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
    const { params } = req;
    const { claimId } = params;
    // TODO submit the data
    res.redirect(
      ROUTES.POA_SUBMISSION_SUCCESSFUL.replace(':claimId', claimId)
    );
  } catch (error) {
    const processedError = processError(
      error,
      "submitting answers"
    );
    next(processedError);
  }
}
