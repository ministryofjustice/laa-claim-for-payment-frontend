import type { Request, Response, NextFunction } from "express";
import { processError } from "#src/helpers/index.js";
import { isValidCourtTypeChoice, ProfitCostDetailsViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsViewModel.js";
import { courtTypeFieldName } from "#src/viewmodels/profitCostDetails/profitCostDetailsFields.js";

/**
 * Choose file upload journey view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function profitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    res.render("main/poa/profitCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ProfitCostDetailsViewModel(),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering profit cost details page"
    );
    next(processedError);
  }
}

/**
 * Submit choose file upload journey
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function submitProfitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // const { params } = req;
    // const { claimId } = params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedCourtTypeChoice: unknown = req.body?.[courtTypeFieldName];
    if (!isValidCourtTypeChoice(selectedCourtTypeChoice)) {
      res.status(400).render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel({
          courtTypeSelectedValue: typeof selectedCourtTypeChoice === "string" ? selectedCourtTypeChoice : undefined,
          error: {
            text: "pages.profitCostDetails.courtType.error.empty",
          },
        }),
      });
      
    }

    // const redirectByTransferOfSolicitorChoice: Record<TransferOfSolicitorChoice, string> = {
    //   [TransferOfSolicitorChoice.Yes]: "",
    //   [TransferOfSolicitorChoice.No]: "",
    // };

    // res.redirect(redirectByTransferOfSolicitorChoice[transferOfSolictorChoice]);

  } catch (error) {
    const processedError = processError(
      error,
      "submitting court or judge type"
    );
    next(processedError);
  }
}

