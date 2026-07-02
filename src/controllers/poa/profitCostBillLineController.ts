import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import { validateProfitCostBillLine, type ProfitCostBillLineForm } from "#src/helpers/profitCostBillLineValidation.js";
import { getForm } from "#src/helpers/validation.js";
import { ProfitCostBillLineViewModel } from "#src/viewmodels/profitCostBillLineViewModel.js";
import type { NextFunction, Request, Response } from "express";

/**
 * Display POA CPGFS profit cost bill line page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function profitCostBillLine(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

    res.render("main/poa/profitCostBillLineView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ProfitCostBillLineViewModel({
        claimId,
      }),
    });
  } catch (error) {
    next(processError(error, "rendering profit cost bill line page"));
  }
}

/**
 * Submit POA CPGFS profit cost bill line page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function submitProfitCostBillLine(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);
    const validationResult = validateProfitCostBillLine(req.body);
    const form = getForm<ProfitCostBillLineForm>(req.body);

    if (!validationResult.isValid) {
      res.status(400).render("main/poa/profitCostBillLineView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostBillLineViewModel({
          claimId,
          form,
          errors: validationResult.errors,
        }),
      });
      return;
    }

    res.redirect(
      buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting profit cost bill line page"));
  }
}