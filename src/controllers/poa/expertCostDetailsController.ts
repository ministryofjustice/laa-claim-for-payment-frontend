import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import {
  ExpertCostDetailsViewModel,
  type ExpertCostDetailsViewModelParams
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import { type ExpertCostDetailsForm, validateExpertCostDetails } from "#src/helpers/expertCostDetailsValidation.js";
import { getForm } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { formatBooleanChoice } from "#src/helpers/dataFormatters.js";
import { CostType, type ExpertCostLineItem, ExpertCostLineItemSchema } from "#src/types/Claim.js";
import type { LineItemForm } from "#src/types/poa.js";

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

    let form: ExpertCostDetailsForm = {};

    if (lineItemId != null) {
      const lineItem = await claimService.getLineItem<ExpertCostLineItem>(
        req.axiosMiddleware,
        claimId,
        lineItemId,
        ExpertCostLineItemSchema,
      );

      if (lineItem.status === "success") {
        form = {
          activityDateDay: lineItem.body.date.getDate().toString(),
          activityDateMonth: (lineItem.body.date.getMonth() + 1).toString(),
          activityDateYear: lineItem.body.date.getFullYear().toString(),
          actualNetValue: lineItem.body.actualNetValue.toString(),
          vatApplies: formatBooleanChoice(lineItem.body.vatApplicable),
          feeEarnerName: lineItem.body.feeEarnerName,
          description: lineItem.body.title,
        };
      } else {
        next(
          processApiError(
            lineItem,
            "retrieving line item for rendering expert cost details page",
          ),
        );
      }
    }

    const params: ExpertCostDetailsViewModelParams = {
      claimId,
      lineItemId,
      form,
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
export async function submitExpertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = getClaimId(req);
    const lineItemId = getLineItemId(req);

    const form = getForm(req.body) as ExpertCostDetailsForm;
    const validationResult = validateExpertCostDetails(form);

    if (!validationResult.isValid) {
      const params: ExpertCostDetailsViewModelParams = {
        claimId,
        lineItemId,
        form,
        errors: validationResult.errors,
      };

      res.status(400).render("main/poa/expertCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ExpertCostDetailsViewModel(params),
      });
      return;
    }

    const lineItemForm: LineItemForm = {
      type: CostType.EXPERT_COST,
      value: validationResult.value,
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

function getClaimId(req: Request): UUID {
  return UUID.parse(req.params.claimId);
}

function getLineItemId(req: Request): UUID | undefined {
  return typeof req.query.lineItemId === "string"
    ? UUID.parse(req.query.lineItemId)
    : undefined;
}
