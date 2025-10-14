import { createProcessedError } from "#src/helpers/errorHandler.js";
import { claimService } from "#src/services/claimService.js";
import type { Request, Response, NextFunction } from "express";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { parseNumberQueryParam } from "#src/helpers/index.js";
import { InvalidPageError } from "#src/types/errors.js";

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

    const currentPage = parseNumberQueryParam(req.query.page, 1);
    const response = await claimService.getClaims(req.axiosMiddleware, currentPage);

    if (response.status === "success") {
      const claimsTableViewModel: ClaimsTableViewModel = new ClaimsTableViewModel(
        response.body.data,
        response.body.meta,
        req.path
      );

      res.render("main/index.njk", {
        rows: claimsTableViewModel.rows,
        head: claimsTableViewModel.head,
        pagination: claimsTableViewModel.pagination,
      });
    } else {
      res.status(NOT_FOUND).render("main/error.njk", {
        status: "404",
        error: response.message ?? "Claims not found",
      });
    }
  } catch (error) {
    if (error instanceof InvalidPageError) {
      console.info(error.message);
      res.redirect(`${req.path}?page=${error.pageToRedirectTo}`);
    } else {
      // Use the error processing utility
      const processedError = createProcessedError(error, `fetching claims details for user`);

      // Pass the processed error to the global error handler
      next(processedError);
    }
  }
}
