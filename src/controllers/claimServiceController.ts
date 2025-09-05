import { createProcessedError } from "#src/helpers/errorHandler.js";
import { claimService } from "#src/services/claimService.js";
import type { Request, Response, NextFunction } from "express";
import { ClaimsTableViewModel } from '#src/viewmodels/claimsViewModel.js';

const NOT_FOUND = 404;

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function handleYourClaimsPage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Fetch client details from API
    const response = await claimService.getClaims(req.axiosMiddleware);
    const minimumApiReponseLength = 0;

    if (response.status === "success" && response.data.length > minimumApiReponseLength) {
      const claimsTableViewModel: ClaimsTableViewModel = new ClaimsTableViewModel(response.data);

      res.render("main/index.njk", {
        rows: claimsTableViewModel.rows,
        head: claimsTableViewModel.head
      });
    } else {
      res.status(NOT_FOUND).render("main/error.njk", {
        status: "404",
        error: response.message ?? "Claims not found",
      });
    }
  } catch (error) {
    // Use the error processing utility
    const processedError = createProcessedError(error, `fetching claims details for user`);

    // Pass the processed error to the global error handler
    next(processedError);
  }
}
