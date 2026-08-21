import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { AddAnotherDisbursementViewModel } from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import {
  type Claim,
  CostType,
  type DisbursementCostType,
  type ExpertCostLineItem, isDisbursementCostType,
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
        const lineItems: ExpertCostLineItem[] = getLineItems(claim);
        if (lineItems.length === 0) {
          res.redirect(buildRoute(ROUTES.DISBURSEMENT_DETAILS, { claimId }));
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
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
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
          res.redirect(buildRoute(ROUTES.DISBURSEMENT_DETAILS, { claimId }));
        } else {
          res.redirect(buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, { claimId }));
        }
      } else {
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
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

function getLineItems(claim: Claim): ExpertCostLineItem[] {
  return claim.lineItems.map(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
    (lineItem) => lineItem as ExpertCostLineItem,
  );
}

function buildField(costType: DisbursementCostType): BooleanField {
  const messagePrefix: string = (() => {
    switch (costType) {
      case CostType.EXPERT_COST:
        return "pages.poa.expertCostDetails";
      case CostType.NON_EXPERT_DISBURSEMENT:
        return "pages.poa.nonExpertDisbursementDetails";
    }
  })();
  return new BooleanField(
    `${messagePrefix}.addAnother`,
    "addAnother",
    "add-another",
  );
}
