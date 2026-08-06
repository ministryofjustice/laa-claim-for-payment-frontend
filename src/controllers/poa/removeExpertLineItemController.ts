import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { booleanChoices } from "#src/models/booleanChoice.js";
import { validateBooleanInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { type ExpertCostLineItem, ExpertCostLineItemSchema } from "#src/types/Claim.js";
import type { ApiResponse } from "#src/types/api-types.js";

const confirmRemoveExpertLineItemFieldName = "confirmRemoveExpertLineItem" as const;

/**
 * get confirm remove expert line item page
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function confirmRemoveExpertLineItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);
    const lineItemId = UUID.parse(req.params.lineItemId);

    const lineItem: ApiResponse<ExpertCostLineItem> = await claimService.getLineItem<ExpertCostLineItem>(
      req.axiosMiddleware,
      claimId,
      lineItemId,
      ExpertCostLineItemSchema
    );

    if (lineItem.status === "success") {
      res.render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.poa.removeExpertLineItem.title",
          },
          fieldName: confirmRemoveExpertLineItemFieldName,
          choices: booleanChoices,
        }),
      });
    } else {
      next(
        processApiError(
          lineItem,
          "retrieving lineitem for rendering confirm remove expert line item page",
        ),
      );
    }
  } catch (error) {
    const processedError = processError(
      error,
      "rendering confirm remove expert line item page",
    );
    next(processedError);
  }
}

/**
 * Submit remove expert line item page
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function submitRemoveExpertLineItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[confirmRemoveExpertLineItemFieldName];
    const claimId = UUID.parse(req.params.claimId);
    const lineItemId = UUID.parse(req.params.lineItemId);

    const validationResult = validateBooleanInput(
      selectedChoice,
      confirmRemoveExpertLineItemFieldName,
      confirmRemoveExpertLineItemFieldName,
      "pages.poa.removeExpertLineItem",
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.poa.removeExpertLineItem.title",
          },
          fieldName: confirmRemoveExpertLineItemFieldName,
          choices: booleanChoices,
          selectedValue:
            typeof selectedChoice === "string" ? selectedChoice : undefined,
          errors: validationResult.errors,
        }),
      });
      return;
    }

    const nextPage = buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, { claimId });

    if(validationResult.value) {

      const deleted = await claimService.deleteLineItem(
        req.axiosMiddleware,
        claimId,
        lineItemId,
      );
      
      if (deleted.status === "success") {
        res.redirect(nextPage)
        return;
      } else {
        next(
          processApiError(
            deleted,
            "deleteing line item for expert cost page",
          ),
        );
      }
    }

    res.redirect(nextPage)

    } catch (error) {
      const processedError = processError(
        error,
        "submitting escaping fixed fee page",
      );
      next(processedError);
  }
}

