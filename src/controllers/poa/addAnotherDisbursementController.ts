import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { AddAnotherDisbursementViewModel } from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import {
  type Claim,
  type DisbursementCostType,
  DisbursementCostTypeMessagePrefix,
  type DisbursementLineItem,
  isDisbursementCostType
} from "#src/types/Claim.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

/**
 * get add another expert cost view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function addAnotherDisbursement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);

    const claimResponse = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claimResponse.status === "success") {
      const { body: claim } = claimResponse;
      if (isDisbursementCostType(claim.costType)) {
        const lineItems: DisbursementLineItem[] = getLineItems(claim);
        if (lineItems.length === 0) {
          res.redirect(buildRoute(ROUTES.POA.DISBURSEMENTS.DETAILS, { claimId }));
        } else {
          const form = new YesNoQuestionForm(buildField(claim.costType));
          res.render("main/poa/addAnotherDisbursementView.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new AddAnotherDisbursementViewModel({
              claimId: claimId.toString(),
              lineItems,
              form,
            }),
          });
        }
      } else {
        res.redirect(buildRoute(ROUTES.POA.CLAIM_TYPE, { claimId }));
      }
    } else {
      next(
        processApiError(
          claimResponse,
          "retrieving claim for rendering add another expert cost page",
        ),
      );
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
export async function submitAddAnotherDisbursement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);

    const claimResponse = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claimResponse.status === "success") {
      const { body: claim } = claimResponse;
      if (isDisbursementCostType(claim.costType)) {
        const field = buildField(claim.costType);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
        const selectedChoice: unknown = req.body?.[field.name];
        const form = new YesNoQuestionForm(field);
        form.validate(selectedChoice);
        if (form.isNotValid()) {
          const lineItems = getLineItems(claim);
          res.status(400).render("main/poa/addAnotherDisbursementView.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new AddAnotherDisbursementViewModel({
              claimId: claimId.toString(),
              lineItems,
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
      } else {
        res.redirect(buildRoute(ROUTES.POA.CLAIM_TYPE, { claimId }));
      }
    } else {
      next(
        processApiError(
          claimResponse,
          "retrieving claim for submitting add another expert cost page",
        ),
      );
    }
  } catch (error) {
    const processedError = processError(
      error,
      "submitting add another expert cost page",
    );
    next(processedError);
  }
}

function getLineItems(claim: Claim): DisbursementLineItem[] {
  return claim.lineItems.map(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
    (lineItem) => lineItem as DisbursementLineItem,
  );
}

function buildField(costType: DisbursementCostType): BooleanField {
  const messagePrefix: string = DisbursementCostTypeMessagePrefix[costType];
  return new BooleanField(
    `${messagePrefix}.addAnother`,
    "addAnother",
    "add-another",
  );
}
