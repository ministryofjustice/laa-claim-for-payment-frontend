import { claimService } from "#src/services/claimService.js";
import type { NextFunction, Request, Response } from "express";
import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";
import { processApiError, processError } from "#src/helpers/index.js";

const NOT_FOUND = 404;

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function viewClaimPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response;
      const vm = new ClaimViewModel(claim);

      res.render("main/claims/view.njk", { vm });
    } else {
      next(processApiError(response, `fetching claim details for user`));
    }
  } catch (error) {
    next(processError(error, `fetching claim details for user`));
  }
}
