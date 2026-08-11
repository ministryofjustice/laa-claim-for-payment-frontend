import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { validateBooleanInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { AddAnotherExpertCostViewModel } from "#src/viewmodels/poa/addAnotherLineItemViewModel.js";
import type { Claim, ExpertCostLineItem } from "#src/types/Claim.js";

export const addAnotherExpertCostFieldName = "addAnother" as const;
export const addAnotherExpertCostFieldId = "add-another" as const;

/**
 * get add another expert cost view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function addAnotherExpertCost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      const lineItems: ExpertCostLineItem[] = getLineItems(claim.body);
      if (lineItems.length === 0) {
        res.redirect(buildRoute(ROUTES.EXPERT_COST_DETAILS, { claimId }));
      } else {
        res.render("main/poa/addAnotherLineItemView.njk", {
          csrfToken: res.locals.csrfToken,
          vm: new AddAnotherExpertCostViewModel({
            claimId: claimId.toString(),
            lineItems,
          }),
        });
      }
    } else {
      next(
        processApiError(
          claim,
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
export async function submitAddAnotherExpertCost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[addAnotherExpertCostFieldName];

    const validationResult = validateBooleanInput(
      selectedChoice,
      addAnotherExpertCostFieldName,
      addAnotherExpertCostFieldId,
      "pages.poa.expertCostDetails.addAnother",
    );

    const claimId = UUID.parse(req.params.claimId);

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      if (!validationResult.isValid) {
        const lineItems = getLineItems(claim.body);
        res.status(400).render("main/poa/addAnotherLineItemView.njk", {
          csrfToken: res.locals.csrfToken,
          vm: new AddAnotherExpertCostViewModel({
            claimId: claimId.toString(),
            lineItems,
            errors: validationResult.errors,
          }),
        });
        return;
      }

      if (validationResult.value) {
        res.redirect(buildRoute(ROUTES.EXPERT_COST_DETAILS, { claimId }));
      } else {
        res.redirect(buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, { claimId }));
      }
    } else {
      next(
        processApiError(
          claim,
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
