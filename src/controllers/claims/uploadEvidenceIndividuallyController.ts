import type { NextFunction, Request, Response } from "express";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claimService } from "#src/services/claimService.js";
import { processError } from "#public/src/helpers/index.js";
import { processApiError } from "#src/helpers/index.js";

/**
 * Handle upload evidence individually view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function viewUploadEvidenceIndividuallyPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response;
      const vm = new UploadEvidenceIndividuallyViewModel(claim);
      res.render("main/claims/uploadEvidenceIndividually.njk", { vm });
    } else {
      next(processApiError(response, `fetching evidence upload details for user`));
    }
  } catch (error) {
    next(processError(error, `fetching evidence upload details for user`));
  }
}
