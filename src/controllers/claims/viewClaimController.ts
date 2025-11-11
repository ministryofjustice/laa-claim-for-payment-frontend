import { createProcessedError } from "#src/helpers/errorHandler.js";
import { claimService } from "#src/services/claimService.js";
import type { Request, Response, NextFunction } from "express";
import { InvalidPageError } from "#src/types/errors.js";
import { ClaimViewModel } from "#src/viewmodels/claimViewModel.js";

const NOT_FOUND = 404;

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function viewClaimsPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response
      const vm = new ClaimViewModel(claim);

      res.render("main/claims/view.njk", {vm});
    } else {
      res.status(NOT_FOUND).render("main/error.njk", {
        status: "404",
        error: response.message,
      });
    }
  } catch (error) {
    if (error instanceof InvalidPageError) {
      console.info(error.message);
      res.redirect(`${req.path}?page=${error.pageToRedirectTo}`);
    } else {
      const processedError = createProcessedError(error, `fetching claim details for user`);
      next(processedError);
    }
  }
}
