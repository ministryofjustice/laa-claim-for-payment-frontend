import type { Request, Response, NextFunction } from "express";
import { processError } from "#src/helpers/index.js";
import {
  isValidClientStatusChoice,
  isValidCourtTypeChoice,
  isValidFirstSolicitorChoice,
  isValidTransferOfSolicitorChoice,
  ProfitCostDetailsViewModel,
  type ProfitCostDetailsViewModelParams,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsViewModel.js";
import {
  clientStatusFieldName,
  courtTypeFieldName,
  firstSolicitorFieldName,
  TransferOfSolicitorChoice,
  transferOfSolicitorFieldName,
} from "#src/viewmodels/profitCostDetails/profitCostDetailsFields.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

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
    /* eslint-disable @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary. */
    const selectedCourtTypeChoice: unknown = req.body?.[courtTypeFieldName];
    const selectedClientStatusChoice: unknown =
      req.body?.[clientStatusFieldName];
    const selectedFirstSolicitorChoice: unknown =
      req.body?.[firstSolicitorFieldName];
    const selectedTransferOfSolicitorChoice: unknown =
      req.body?.[transferOfSolicitorFieldName];
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */

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

    if (!isValidTransferOfSolicitorChoice(selectedTransferOfSolicitorChoice)) {
      errors.transferOfSolicitorError = {
        text: "pages.profitCostDetails.transferOfSolicitor.error.empty",
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

          transferOfSolicitorSelectedValue:
            typeof selectedTransferOfSolicitorChoice === "string"
              ? selectedTransferOfSolicitorChoice
              : undefined,

          error: errors,
        }),
      });
      return;
    }

    const claimId = Number(req.params.claimId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe to assert as TransferOfSolicitorChoice because validation has already occurred
    const validatedTransferOfSolicitorChoice = selectedTransferOfSolicitorChoice as TransferOfSolicitorChoice;

    const redirectByTransferOfSolicitorChoice: Record<TransferOfSolicitorChoice,string> = {
      [TransferOfSolicitorChoice.Yes]: buildRoute(
        ROUTES.HOW_MANY_CLIENTS_RETAINED,
        { claimId },
      ),
      [TransferOfSolicitorChoice.No]: buildRoute(
        ROUTES.HOW_MANY_CLIENTS_AT_START_OF_CASE,
        { claimId },
      ),
    };

    res.redirect(
      redirectByTransferOfSolicitorChoice[validatedTransferOfSolicitorChoice],
    );
  } catch (error) {
    const processedError = processError(
      error,
      "submitting court or judge type",
    );
    next(processedError);
  }
}
