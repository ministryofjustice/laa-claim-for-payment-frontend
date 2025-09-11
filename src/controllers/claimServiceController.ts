import { createProcessedError } from "#src/helpers/errorHandler.js";
import { claimService } from "#src/services/claimService.js";
import type { Request, Response, NextFunction } from "express";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { parseNumberQueryParam } from "#src/helpers/index.js";
import { InvalidPageError } from "#src/types/api-types.js";

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
    const minimumApiReponseLength = 0;

    if (response.status === "success" && response.data.length > minimumApiReponseLength) {
      try {
        const claimsTableViewModel: ClaimsTableViewModel = new ClaimsTableViewModel(
          response.data,
          response.pagination
        );

        res.render("main/index.njk", {
          rows: claimsTableViewModel.rows,
          head: claimsTableViewModel.head,
          pagination: claimsTableViewModel.pagination,
        });
      } catch (err) {
        if (err instanceof InvalidPageError) {
          console.info(err.message);
          res.redirect(`${req.path}?page=${err.pageToRedirectTo}`);
        }
      }
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
