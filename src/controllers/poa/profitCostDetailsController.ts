import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { ProfitCostDetailsViewModel } from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { getRequestBody } from "#src/helpers/validation.js";
import { ProfitCostDetailsForm, type ProfitCostDetailsRequestBody } from "#src/helpers/profitCostDetailsValidation.js";
import { claimService } from "#src/services/claimService.js";
import { getId } from "#src/helpers/queryParsers.js";

/**
 * Profit cost details journey view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function profitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = getId(req.params.claimId);

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      const form = new ProfitCostDetailsForm();
      if (claim.body.courtType != null) {
        form.fill({ courtType: claim.body.courtType });
      }

      if (claim.body.clientPartyStatus != null) {
        form.fill({ clientStatus: claim.body.clientPartyStatus });
      }

      if (claim.body.firstActingSolicitorFlag != null) {
        form.fill({ firstSolicitor: claim.body.firstActingSolicitorFlag });
      }

      if (claim.body.transferOfSolicitorFlag != null) {
        form.fill({ transferOfSolicitor: claim.body.transferOfSolicitorFlag });
      }

      res.render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel({ form }),
      });
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for rendering profit cost details page",
        ),
      );
    }
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

    const claimId = getId(req.params.claimId);

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      await claimService.updateClaim(
        req.axiosMiddleware,
        claim.body.setProfitCostDetails(form.getValue()),
      );

      const redirectUrl = form.getValue().transferOfSolicitor
        ? buildRoute(ROUTES.HOW_MANY_CLIENTS_RETAINED, { claimId })
        : buildRoute(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, { claimId });

      res.redirect(redirectUrl);
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for submitting profit cost details page",
        ),
      );
    }
  } catch (error) {
    const processedError = processError(
      error,
      "submitting profit cost details page",
    );
    next(processedError);
  }
}
