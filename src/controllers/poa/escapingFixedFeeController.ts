import { RadioQuestionViewModel, type YesNoQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { draftService } from "#src/services/draftService.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import { requireClaim } from "#src/helpers/claimGuards.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function escapingFixedFee(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);

    const form = new YesNoQuestionForm(buildField());
    if (claim.escapedFlag != null) {
      form.fill(claim.escapedFlag);
    }
    res.render("main/poa/escapingFixedFeeView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: buildViewModel(form),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering escaping fixed fee page",
    );
    next(processedError);
  }
}

/**
 * Submit how many clients retained
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function submitEscapingFixedFee(
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

    if (form.isNotValid()) {
      res.status(400).render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
      return;
    }

    const claim = requireClaim(req);

    await draftService.setEscapedFlag(
      req.axiosMiddleware,
      claim,
      form.getValue(),
    );

    res.redirect(buildRoute(ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE, { claimId: claim.id }));
  } catch (error) {
    const processedError = processError(
      error,
      "submitting escaping fixed fee page",
    );
    next(processedError);
  }
}

function buildField(): BooleanField {
  const messagePrefix = "pages.escapingFixedFee";
  return new BooleanField(messagePrefix, "escapingFixedFee", "escapingFixedFee");
}

function buildViewModel(
  form: YesNoQuestionForm,
): YesNoQuestionViewModel {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.question`,
    form,
    isLegendPageHeading: false,
  });
}
