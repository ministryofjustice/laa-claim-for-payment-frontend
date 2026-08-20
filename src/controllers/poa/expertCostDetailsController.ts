import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import { ExpertCostDetailsViewModel } from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import {
  ExpertCostDetailsForm,
  type ExpertCostDetailsRequestBody,
} from "#src/helpers/expertCostDetailsValidation.js";
import { getRequestBody } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import {
  Claim,
  CostType,
  DisbursementCostType,
  type ExpertCostLineItem,
} from "#src/types/Claim.js";
import type { LineItemForm } from "#src/types/poa.js";
import createHttpError from "http-errors";

/**
 * Display POA expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export async function expertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = getClaimId(req);
    const lineItemId = getLineItemId(req);

    const claimResponse = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claimResponse.status === "success") {
      const { body: claim } = claimResponse;
      if (isDisbursementCostType(claim.costType)) {
        const form = new ExpertCostDetailsForm(claim.costType);

        if (lineItemId != null) {
          const lineItem = getLineItem(claim, lineItemId);

          if (lineItem === undefined) {
            next(
              new createHttpError.NotFound(
                `Line item ${lineItemId.toString()} not found`,
              ),
            );
            return;
          }

          form.fill({
            activityDate: lineItem.date,
            actualNetValue: lineItem.actualNetValue,
            vatApplies: lineItem.vatApplicable,
            feeEarnerName: lineItem.feeEarnerName,
            description: lineItem.title,
          });
        }

        res.render("main/poa/expertCostDetailsView.njk", {
          csrfToken: res.locals.csrfToken,
          vm: new ExpertCostDetailsViewModel({ form }),
        });
      } else {
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
      }
    } else {
      next(
        processApiError(
          claimResponse,
          "retrieving line item for rendering expert cost details page",
        ),
      );
    }
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
export async function submitExpertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = getClaimId(req);
    const lineItemId = getLineItemId(req);

    const requestBody = getRequestBody(
      req.body,
    ) as ExpertCostDetailsRequestBody;

    const claimResponse = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claimResponse.status === "success") {
      const { body: claim } = claimResponse;
      if (isDisbursementCostType(claim.costType)) {
        const form = new ExpertCostDetailsForm(claim.costType);
        form.validate(requestBody);
        if (form.isNotValid()) {
          res.status(400).render("main/poa/expertCostDetailsView.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new ExpertCostDetailsViewModel({ form }),
          });
          return;
        }

        const lineItemForm: LineItemForm = {
          type: CostType.EXPERT_COST,
          value: form.getValue(),
        };

        if (lineItemId == null) {
          await claimService.addLineItemToClaim(
            req.axiosMiddleware,
            claimId,
            lineItemForm,
          );
        } else {
          await claimService.updateLineItem(
            req.axiosMiddleware,
            claimId,
            lineItemId,
            lineItemForm,
          );
        }

        res.redirect(
          buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, {
            claimId,
          }),
        );
      } else {
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
      }
    } else {
      next(
        processApiError(
          claimResponse,
          "retrieving claim for submitting expert cost details page",
        ),
      );
    }
  } catch (error) {
    next(processError(error, "submitting expert cost details page"));
  }
}

function getClaimId(req: Request): UUID {
  return UUID.parse(req.params.claimId);
}

function getLineItemId(req: Request): UUID | undefined {
  return typeof req.query.lineItemId === "string"
    ? UUID.parse(req.query.lineItemId)
    : undefined;
}

function getLineItem(
  claim: Claim,
  lineItemId: UUID,
): ExpertCostLineItem | undefined {
  return claim.lineItems.find(
    (lineItem): lineItem is ExpertCostLineItem =>
      lineItem.id === lineItemId.toString(),
  );
}

function isDisbursementCostType(
  costType: CostType | null | undefined,
): costType is DisbursementCostType {
  return (
    costType === CostType.EXPERT_COST ||
    costType === CostType.NON_EXPERT_DISBURSEMENT
  );
}
