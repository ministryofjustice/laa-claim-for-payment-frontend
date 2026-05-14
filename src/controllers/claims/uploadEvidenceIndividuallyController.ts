import { createProcessedError } from "#src/helpers/errorHandler.js";
import type { NextFunction, Request, Response } from "express";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { claimService } from "#src/services/claimService.js";


const NOT_FOUND = 404;

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
      const { body: claim } = response
      const vm = new UploadEvidenceIndividuallyViewModel(claim);
      res.render("main/claims/uploadEvidenceIndividually.njk", { vm });
      
    } else {
      res.status(NOT_FOUND).render("main/error.njk", {
        status: "404",
        error: response.message,
      });
    }
            
    } catch (error) {
    const processedError = createProcessedError(
      error,
      `fetching evidence upload details for user`,
    );
    next(processedError);
  }
}
