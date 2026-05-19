import type { NextFunction, Request, Response } from "express";
import { UploadEvidenceIndividuallyViewModel } from "#src/viewmodels/uploadEvidenceIndividuallyViewModel.js";
import { processError } from "#src/helpers/index.js";

/**
 * Handle upload evidence individually view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
// eslint-disable-next-line @typescript-eslint/require-await -- temporary while we aren't fetching anything
export async function viewUploadEvidenceIndividuallyPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const vm = new UploadEvidenceIndividuallyViewModel();
    res.render("main/claims/uploadEvidenceIndividually.njk", { vm });
  } catch (error) {
    const processedError = processError(
      error,
      `fetching evidence upload details for user`,
    );
    next(processedError);
  }
}
