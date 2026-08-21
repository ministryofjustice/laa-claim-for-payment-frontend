import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import { ExpertCostDetailsViewModel } from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { ExpertCostDetailsForm, type ExpertCostDetailsRequestBody } from "#src/helpers/expertCostDetailsValidation.js";
import { getRequestBody } from "#src/helpers/validation.js";
import type { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { CostType, type ExpertCostLineItem, ExpertCostLineItemSchema } from "#src/types/Claim.js";
import type { LineItemForm } from "#src/types/poa.js";
import { getId } from "#src/helpers/queryParsers.js";

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
    const claimId = getId(req.params.claimId);
    const lineItemId = getLineItemId(req);

    const form = new ExpertCostDetailsForm();

    if (lineItemId != null) {
      const lineItemResponse =
        await claimService.getLineItem<ExpertCostLineItem>(
          req.axiosMiddleware,
          claimId,
          lineItemId,
          ExpertCostLineItemSchema,
        );

      if (lineItemResponse.status === "success") {
        const { body: lineItem } = lineItemResponse;
        form.fill({
          activityDate: lineItem.date,
          actualNetValue: lineItem.actualNetValue,
          vatApplies: lineItem.vatApplicable,
          feeEarnerName: lineItem.feeEarnerName,
          description: lineItem.title,
        });
      } else {
        next(
          processApiError(
            lineItemResponse,
            "retrieving line item for rendering expert cost details page",
          ),
        );
      }
    }

    res.render("main/poa/expertCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ExpertCostDetailsViewModel({ form }),
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
export async function submitExpertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = getId(req.params.claimId);
    const lineItemId = getLineItemId(req);

    const requestBody = getRequestBody(
      req.body,
    ) as ExpertCostDetailsRequestBody;

    const form = new ExpertCostDetailsForm();
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
  } catch (error) {
    next(processError(error, "submitting expert cost details page"));
  }
}

function getLineItemId(req: Request): UUID | undefined {
  try {
    return getId(req.query.lineItemId);
  } catch {
    return undefined;
  }
}
