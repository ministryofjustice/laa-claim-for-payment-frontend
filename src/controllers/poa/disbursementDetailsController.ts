import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import { DisbursementDetailsViewModel } from "#src/viewmodels/poa/disbursementDetailsViewModel.js";
import {
  DisbursementDetailsForm,
  type DisbursementDetailsRequestBody
} from "#src/helpers/disbursementDetailsValidation.js";
import { getRequestBody } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { type Claim, CostType, type DisbursementLineItem } from "#src/types/Claim.js";
import type { LineItemForm } from "#src/types/poa.js";
import createHttpError from "http-errors";
import { requireClaim, requireDisbursementCostType } from "#src/helpers/claimGuards.js";

/**
 * Display POA expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function disbursementDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const lineItemId = getLineItemId(req);
    const costType = requireDisbursementCostType(claim);

    const form = new DisbursementDetailsForm(costType);

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

    res.render("main/poa/disbursementDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new DisbursementDetailsViewModel({ form }),
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
export async function submitDisbursementDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    const lineItemId = getLineItemId(req);
    const costType = requireDisbursementCostType(claim);

    const requestBody = getRequestBody(
      req.body,
    ) as DisbursementDetailsRequestBody;

    const form = new DisbursementDetailsForm(costType);
    form.validate(requestBody);
    if (form.isNotValid()) {
      res.status(400).render("main/poa/disbursementDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new DisbursementDetailsViewModel({ form }),
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
        lineItemId.toString(),
        lineItemForm,
      );
    }

    res.redirect(
      buildRoute(ROUTES.POA.DISBURSEMENTS.ADD, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting expert cost details page"));
  }
}

function getLineItemId(req: Request): UUID | undefined {
  return typeof req.query.lineItemId === "string"
    ? UUID.parse(req.query.lineItemId)
    : undefined;
}

function getLineItem(
  claim: Claim,
  lineItemId: UUID,
): DisbursementLineItem | undefined {
  return claim.lineItems.find(
    (lineItem): lineItem is DisbursementLineItem =>
      lineItem.id === lineItemId.toString(),
  );
}
