import { createProcessedError } from '#src/scripts/helpers/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';
import { claimService } from "#src/services/claimService.js";
import { FileUploadForLineItemViewModel } from '#src/viewmodels/fileUploadForLineItemViewModel.js';


const NOT_FOUND = 404;

/**
 * File upload page for Bill narrative
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function fileUploadForLineItemPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const lineItemId = Number(req.params.lineItemId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status === "success") {
      const { body: claim } = response
      // TODO: This should be linked to the line item ids from the model
      const lineItems = [
        {id: 1, title: "Bill Narrative"},
        {id: 2, title: "Interim hearing on 20 December 2023"}
      ]
      const lineItem = lineItems.find((item) => item.id === lineItemId);
      if (lineItem === undefined) {
        res.status(NOT_FOUND).render("main/error.njk", {
          status: "404",
        });
        return;
      }

      const vm = new FileUploadForLineItemViewModel(claim, lineItem);
      res.render("main/claims/fileUploadForLineItemView.njk", { vm });
    
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