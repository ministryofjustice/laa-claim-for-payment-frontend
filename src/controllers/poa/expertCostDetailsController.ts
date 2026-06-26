import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import {
  ExpertCostDetailsViewModel,
  type ExpertCostDetailsViewModelParams
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { type ExpertCostDetailsForm, validateExpertCostDetails } from "#src/helpers/expertCostDetailsValidation.js";
import { getForm } from "#src/helpers/validation.js";

/**
 * Display POA expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function expertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);
    const expertCostId = Number(req.params.expertCostId);

    const params: ExpertCostDetailsViewModelParams = {
      claimId,
      expertCostId,
    };

    res.render("main/poa/expertCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ExpertCostDetailsViewModel(params),
    });
  } catch (error) {
    next(processError(error, "rendering expert cost details page"));
  }
}

/**
 * Submit expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function submitExpertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);
    const expertCostId = Number(req.params.expertCostId);

    const form = getForm(req.body) as ExpertCostDetailsForm;
    const validationResult = validateExpertCostDetails(form);

    if (!validationResult.isValid) {
      const params: ExpertCostDetailsViewModelParams = {
        claimId,
        expertCostId,
        form,
        errors: validationResult.errors
      };

      res.status(400).render("main/poa/expertCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ExpertCostDetailsViewModel(params),
      });
      return;
    }

    // TODO - redirect to the 'add another work item' page
    res.redirect(
      buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting expert cost details page"));
  }
}