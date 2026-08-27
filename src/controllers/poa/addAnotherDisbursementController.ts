import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { AddAnotherDisbursementViewModel } from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import {
  type DisbursementCostType,
  DisbursementCostTypeMessagePrefix,
  type DisbursementLineItem
} from "#src/types/Claim.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import { requireClaim, requireDisbursementCostType } from "#src/helpers/claimGuards.js";

/**
 * get add another expert cost view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function addAnotherDisbursement(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    const costType = requireDisbursementCostType(claim);

    const lineItems: DisbursementLineItem[] = claim.disbursementLineItems;
    if (lineItems.length === 0) {
      res.redirect(buildRoute(ROUTES.POA.DISBURSEMENTS.DETAILS, { claimId }));
    } else {
      const form = new YesNoQuestionForm(buildField(costType));
      res.render("main/poa/addAnotherDisbursementView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new AddAnotherDisbursementViewModel({
          claimId,
          lineItems,
          form,
        }),
      });
    }
  } catch (error) {
    const processedError = processError(
      error,
      "rendering add another expert cost page",
    );
    next(processedError);
  }
}

/**
 * Submit add another expert cost
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function submitAddAnotherDisbursement(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    const costType = requireDisbursementCostType(claim);

    const field = buildField(costType);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    const form = new YesNoQuestionForm(field);
    form.validate(selectedChoice);
    if (form.isNotValid()) {
      res.status(400).render("main/poa/addAnotherDisbursementView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new AddAnotherDisbursementViewModel({
          claimId,
          lineItems: claim.disbursementLineItems,
          form,
        }),
      });
      return;
    }

    if (form.getValue()) {
      res.redirect(buildRoute(ROUTES.POA.DISBURSEMENTS.DETAILS, { claimId }));
    } else {
      res.redirect(buildRoute(ROUTES.POA.EVIDENCE_UPLOAD, { claimId }));
    }
  } catch (error) {
    const processedError = processError(
      error,
      "submitting add another expert cost page",
    );
    next(processedError);
  }
}

function buildField(costType: DisbursementCostType): BooleanField {
  const messagePrefix: string = DisbursementCostTypeMessagePrefix[costType];
  return new BooleanField(
    `${messagePrefix}.addAnother`,
    "addAnother",
    "add-another",
  );
}
