import { RadioQuestionViewModel, type YesNoQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { claimService } from "#src/services/claimService.js";
import { BooleanField } from "#src/helpers/fields.js";
import { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import { requireClaim } from "#src/helpers/claimGuards.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function multipleClientHearings(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);

    const form = new YesNoQuestionForm(buildField());
    if (claim.multiClientHearingFlag != null) {
      form.fill(claim.multiClientHearingFlag);
    }
    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: buildViewModel(form),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering multiple client hearings page",
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
export async function submitMultipleClientHearings(
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
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
      return;
    }

    const claim = requireClaim(req);

    await claimService.updateClaim(
      req.axiosMiddleware,
      claim.setMultiClientHearingFlag(form.getValue()),
    );

    res.redirect(buildRoute(ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE, { claimId: claim.id }));
  } catch (error) {
    const processedError = processError(
      error,
      "submitting multiple client hearings page",
    );
    next(processedError);
  }
}

function buildField(): BooleanField {
  const messagePrefix = "pages.multipleClientHearings";
  return new BooleanField(
    messagePrefix,
    "multipleClientHearings",
    "multipleClientHearings",
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
