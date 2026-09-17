import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { ProfitCostDetailsViewModel } from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import { getRequestBody } from "#src/helpers/validation.js";
import { ProfitCostDetailsForm, type ProfitCostDetailsRequestBody } from "#src/helpers/profitCostDetailsValidation.js";
import { claimService } from "#src/services/claimService.js";
import { requireClaim } from "#src/helpers/claimGuards.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";

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
    const claim = requireClaim(req);

    const form = new ProfitCostDetailsForm();
    if (claim.courtType != null) {
      form.fill({ courtType: claim.courtType });
    }

    if (claim.clientPartyStatus != null) {
      form.fill({ clientStatus: claim.clientPartyStatus });
    }

    if (claim.firstActingSolicitorFlag != null) {
      form.fill({ firstSolicitor: claim.firstActingSolicitorFlag });
    }

    if (claim.transferOfSolicitorFlag != null) {
      form.fill({ transferOfSolicitor: claim.transferOfSolicitorFlag });
    }

    res.render("main/poa/profitCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ProfitCostDetailsViewModel({ form }),
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
export async function submitProfitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const requestBody = getRequestBody(
      req.body,
    ) as ProfitCostDetailsRequestBody;

    const form = new ProfitCostDetailsForm();
    form.validate(requestBody);
    if (form.isNotValid()) {
      res.status(400).render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel({ form }),
      });
      return;
    }

    const claim = requireClaim(req);

    await claimService.updateClaim(
      req.axiosMiddleware,
      claim.setProfitCostDetails(form.getValue()),
    );

    const navigator = new PoaNavigator(claim);
    const url = navigator.redirectFromProfitCostDetails(form.getValue());
    res.redirect(url);
  } catch (error) {
    const processedError = processError(
      error,
      "submitting profit cost details page",
    );
    next(processedError);
  }
}
