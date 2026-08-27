import { RadioQuestionViewModel, type YesNoQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import {
  type Claim,
  type DisbursementCostType,
  DisbursementCostTypeMessagePrefix,
  type DisbursementLineItem,
} from "#src/types/Claim.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import createHttpError from "http-errors";
import {
  requireClaim,
  requireDisbursementCostType,
} from "#src/helpers/requireClaim.js";

/**
 * get confirm remove expert line item page
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function confirmRemoveExpertLineItem(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const lineItemId = UUID.parse(req.params.lineItemId);
    const costType = requireDisbursementCostType(claim);

    const lineItem = getLineItem(claim, lineItemId);

    if (lineItem === undefined) {
      next(
        new createHttpError.NotFound(
          `Line item ${lineItemId.toString()} not found`,
        ),
      );
      return;
    }

    const form = new YesNoQuestionForm(buildField(costType));
    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: buildViewModel(form),
    });
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
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    const lineItemId = UUID.parse(req.params.lineItemId);
    const costType = requireDisbursementCostType(claim);

    const field = buildField(costType);
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

    const nextPage = buildRoute(ROUTES.POA.DISBURSEMENTS.ADD, { claimId });

    if (form.getValue()) {
      const deleted = await claimService.deleteLineItem(
        req.axiosMiddleware,
        claimId,
        lineItemId.toString(),
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
  } catch (error) {
    const processedError = processError(
      error,
      "deleting line item for expert cost page",
    );
    next(processedError);
  }
}

function buildField(costType: DisbursementCostType): BooleanField {
  const messagePrefix: string = DisbursementCostTypeMessagePrefix[costType];
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
): DisbursementLineItem | undefined {
  return claim.lineItems.find(
    (lineItem): lineItem is DisbursementLineItem =>
      lineItem.id === lineItemId.toString(),
  );
}
