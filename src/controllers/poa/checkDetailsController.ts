import { claimService } from "#src/services/claimService.js";
import type { NextFunction, Request, Response } from "express";
import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { CheckDetailsViewModel } from "#src/viewmodels/poa/checkDetailsViewModel.js";

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
      next(processApiError(response, `fetching details for user`));
    }
  } catch (error) {
    next(processError(error, `fetching details for user`));
  }
}
