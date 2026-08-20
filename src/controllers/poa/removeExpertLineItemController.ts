import { RadioQuestionViewModel, type YesNoQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import {
  type Claim,
  CostType,
  type DisbursementCostType,
  type ExpertCostLineItem,
  isDisbursementCostType
} from "#src/types/Claim.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import createHttpError from "http-errors";

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

    const claimResponse = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claimResponse.status === "success") {
      const { body: claim } = claimResponse;
      if (isDisbursementCostType(claim.costType)) {
        const lineItem = getLineItem(claim, lineItemId);

        if (lineItem === undefined) {
          next(
            new createHttpError.NotFound(
              `Line item ${lineItemId.toString()} not found`,
            ),
          );
          return;
        }

        const form = new YesNoQuestionForm(buildField(claim.costType));
        res.render("main/radioQuestionPage.njk", {
          csrfToken: res.locals.csrfToken,
          vm: buildViewModel(form),
        });
      } else {
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
      }
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
    const claimId = UUID.parse(req.params.claimId);
    const lineItemId = UUID.parse(req.params.lineItemId);

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
            res.redirect(nextPage);
          } else {
            next(
              processApiError(deleted, "deleting line item for expert cost page"),
            );
          }
        } else {
          res.redirect(nextPage)
        }
      } else {
        res.redirect(buildRoute(ROUTES.POA_CLAIM_TYPE, { claimId }));
      }
    }
  } catch (error) {
    const processedError = processError(
      error,
      "deleting line item for expert cost page",
    );
    next(processedError);
  }
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
    `${messagePrefix}.remove`,
    "confirmRemoveExpertLineItem",
    "confirmRemoveExpertLineItem",
  );
}

function buildViewModel(form: YesNoQuestionForm): YesNoQuestionViewModel {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
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
