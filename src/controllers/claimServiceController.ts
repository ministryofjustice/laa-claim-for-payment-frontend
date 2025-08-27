import { createProcessedError } from "#src/helpers/errorHandler.js";
import { claimService } from "#src/services/claimService.js";
import type { Request, Response, NextFunction } from "express";

const NOT_FOUND = 404;
/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @param {string} activeTab The active tab of the primary navigation
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

    if (response.status === "success" && response.data !== null) {
      const rows = response.data.map((claim) => [
        { text: claim.id },
        { text: claim.client },
        { text: claim.category },
        { text: claim.concluded },
        { text: claim.feeType },
        { text: claim.claimed },
      ]);

      res.render("main/index.njk", {
        rows,
        head: [
          { text: "ID", attributes: { "aria-sort": "ascending" } },
          { text: "Client", attributes: { "aria-sort": "none" } },
          { text: "Category", attributes: { "aria-sort": "none" } },
          { text: "Concluded", attributes: { "aria-sort": "none" } },
          { text: "Fee Type", attributes: { "aria-sort": "none" } },
          { text: "Claimed", attributes: { "aria-sort": "none" } },
        ],
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
