import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import {
  ProfitCostDetailsViewModel,
  type ProfitCostDetailsViewModelParams
} from "#src/viewmodels/profitCostDetails/profitCostDetailsViewModel.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { BooleanChoice } from "#src/models/booleanChoice.js";
import { getForm } from "#src/helpers/validation.js";
import { type ProfitCostDetailsForm, validateProfitCostDetails } from "#src/helpers/profitCostDetailsValidation.js";

/**
 * Profit cost details journey view
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
 * Submit profit cost details journey
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
    const form = getForm(req.body) as ProfitCostDetailsForm;
    const validationResult = validateProfitCostDetails(form);

    if (!validationResult.isValid) {
      const params: ProfitCostDetailsViewModelParams = {
        form,
        errors: validationResult.errors
      };

      res.status(400).render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel(params),
      });
      return;
    }

    const claimId = Number(req.params.claimId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe to assert as TransferOfSolicitorChoice because validation has already occurred
    const validatedTransferOfSolicitorChoice = form.transferOfSolicitorChoice as BooleanChoice;

    const redirectByTransferOfSolicitorChoice: Record<BooleanChoice,string> = {
      [BooleanChoice.Yes]: buildRoute(
        ROUTES.HOW_MANY_CLIENTS_RETAINED,
        { claimId },
      ),
      [BooleanChoice.No]: buildRoute(
        ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
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
