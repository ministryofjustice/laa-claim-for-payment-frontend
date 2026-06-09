import type { Request, Response, NextFunction } from "express";
import { processError } from "#src/helpers/index.js";
import {
  isValidClientStatusChoice,
  isValidCourtTypeChoice,
  isValidFirstSolicitorChoice,
  isValidTransferSolicitorChoice,
  ProfitCostDetailsViewModel,
  ProfitCostDetailsViewModelParams,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsViewModel.js";
import {
  clientStatusFieldName,
  courtTypeFieldName,
  firstSolicitorFieldName,
  transferSolicitorFieldName,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsFields.js";

/**
 * Choose file upload journey view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function profitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    res.render("main/poa/profitCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ProfitCostDetailsViewModel(),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering profit cost details page",
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
  next: NextFunction,
): void {
  try {
    // const { params } = req;
    // const { claimId } = params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedCourtTypeChoice: unknown = req.body?.[courtTypeFieldName];
    const selectedClientStatusChoice: unknown =
      req.body?.[clientStatusFieldName];
    const selectedFirstSolicitorChoice: unknown =
      req.body?.[firstSolicitorFieldName];
    const selectedTransferSolicitorChoice: unknown =
      req.body?.[transferSolicitorFieldName];

    const errors: ProfitCostDetailsViewModelParams["error"] = {};

    if (!isValidCourtTypeChoice(selectedCourtTypeChoice)) {
      errors.courtTypeError = {
        text: "pages.profitCostDetails.courtType.error.empty",
      };
    }

    if (!isValidClientStatusChoice(selectedClientStatusChoice)) {
      errors.clientStatusError = {
        text: "pages.profitCostDetails.clientStatus.error.empty",
      };
    }

    if (!isValidFirstSolicitorChoice(selectedFirstSolicitorChoice)) {
      errors.firstSolicitorError = {
        text: "pages.profitCostDetails.firstSolicitor.error.empty",
      };
    }

    if (!isValidTransferSolicitorChoice(selectedTransferSolicitorChoice)) {
      errors.transferSolicitorError = {
        text: "pages.profitCostDetails.transferSolicitor.error.empty",
      };
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel({
          courtTypeSelectedValue:
            typeof selectedCourtTypeChoice === "string"
              ? selectedCourtTypeChoice
              : undefined,

          clientStatusSelectedValue:
            typeof selectedClientStatusChoice === "string"
              ? selectedClientStatusChoice
              : undefined,

          firstSolicitorSelectedValue:
            typeof selectedFirstSolicitorChoice === "string"
              ? selectedFirstSolicitorChoice
              : undefined,

          transferSolicitorSelectedValue:
            typeof selectedTransferSolicitorChoice === "string"
              ? selectedTransferSolicitorChoice
              : undefined,

          error: errors,
        }),
      });
      return;
    }

    // const redirectByTransferOfSolicitorChoice: Record<TransferOfSolicitorChoice, string> = {
    //   [TransferOfSolicitorChoice.Yes]: "",
    //   [TransferOfSolicitorChoice.No]: "",
    // };

    // res.redirect(redirectByTransferOfSolicitorChoice[transferOfSolictorChoice]);

  } catch (error) {
    const processedError = processError(
      error,
      "submitting court or judge type",
    );
    next(processedError);
  }
}
