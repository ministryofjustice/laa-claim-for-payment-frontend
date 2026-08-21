import { RadioQuestionViewModel, type YesNoQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { type ExpertCostLineItem, ExpertCostLineItemSchema } from "#src/types/Claim.js";
import type { ApiResponse } from "#src/types/api-types.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

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
      const form = new YesNoQuestionForm(buildField());
      res.render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
    } else {
      next(
        processApiError(
          lineItem,
          "retrieving line item for rendering confirm remove expert line item page",
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
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    const form = new YesNoQuestionForm(field);
    form.validate(selectedChoice);

    const claimId = UUID.parse(req.params.claimId);
    const lineItemId = UUID.parse(req.params.lineItemId);

    if (form.isNotValid()) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
      return;
    }

    const nextPage = buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, { claimId });

    if (form.getValue()) {

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
            "deleting line item for expert cost page",
          ),
        );
      }
    }

    res.redirect(nextPage)

    } catch (error) {
      const processedError = processError(
        error,
        "deleting line item for expert cost page",
      );
      next(processedError);
  }
}

function buildField(): BooleanField {
  return new BooleanField(
    "pages.poa.removeExpertLineItem",
    "confirmRemoveExpertLineItem",
    "confirmRemoveExpertLineItem",
  );
}

function buildViewModel(
  form: YesNoQuestionForm,
): YesNoQuestionViewModel {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
}
