import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { booleanChoices } from "#src/models/booleanChoice.js";
import { validateRadioInput } from "#src/helpers/validation.js";

const multipleClientHearingsFieldName = "multipleClientHearings" as const;

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
    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new RadioQuestionViewModel({
        title: {
          key: "pages.multipleClientHearings.title"
        },
        fieldName: multipleClientHearingsFieldName,
        choices: booleanChoices,
      }),
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
export function submitMultipleClientHearings(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[multipleClientHearingsFieldName];

    const validationResult = validateRadioInput(
      booleanChoices,
      selectedChoice,
      multipleClientHearingsFieldName,
      multipleClientHearingsFieldName,
      "pages.multipleClientHearings",
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.multipleClientHearings.title"
          },
          fieldName: multipleClientHearingsFieldName,
          choices: booleanChoices,
          selectedValue:
            typeof selectedChoice === "string" ? selectedChoice : undefined,
          errors: validationResult.errors,
        }),
      });
      return;
    }
    const claimId = Number(req.params.claimId);

    res.redirect(buildRoute(ROUTES.ESCAPING_FIXED_FEE, { claimId }));
  } catch (error) {
    const processedError = processError(
      error,
      "submitting how many clients retained page",
    );
    next(processedError);
  }
}