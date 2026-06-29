import {
  isValidChoice,
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

const howManyClientsRetainedFieldName = "howManyClientsRetained" as const;

const HowManyClientsRetainedChoice = {
  None: "none",
  One: "one",
  MoreThanTwo: "more-than-two",
} as const;

type HowManyClientsRetainedChoice =
  (typeof HowManyClientsRetainedChoice)[keyof typeof HowManyClientsRetainedChoice];

const howManyClientsRetainedChoices: ReadonlyArray<RadioQuestionOptions<HowManyClientsRetainedChoice>> =
  [
    {
      value: HowManyClientsRetainedChoice.None,
      text: {
        key: "pages.howManyClientsRetained.none.text",
      },
    },
    {
      value: HowManyClientsRetainedChoice.One,
      text: {
        key: "pages.howManyClientsRetained.one.text",
      },
    },
    {
      value: HowManyClientsRetainedChoice.MoreThanTwo,
      text: {
        key: "pages.howManyClientsRetained.moreThanTwo.text",
      },
    },
  ];

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function howManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new RadioQuestionViewModel({
        title: "pages.howManyClientsRetained.title",
        fieldName: howManyClientsRetainedFieldName,
        choices: howManyClientsRetainedChoices,
      }),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering how many clients retained page",
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
export function submitHowManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[howManyClientsRetainedFieldName];

    if (!isValidChoice(howManyClientsRetainedChoices, selectedChoice)) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: "pages.howManyClientsRetained.title",
          fieldName: howManyClientsRetainedFieldName,
          choices: howManyClientsRetainedChoices,
          selectedValue:
            typeof selectedChoice === "string" ? selectedChoice : undefined,
          error: {
            text: {
              key: "pages.howManyClientsRetained.error.empty"
            },
          },
        }),
      });
      return;
    }

    const claimId = Number(req.params.claimId);

    const redirectByChoice: Record<HowManyClientsRetainedChoice, string> = {
      [HowManyClientsRetainedChoice.None]: buildRoute(
        ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
        { claimId },
      ),
      [HowManyClientsRetainedChoice.One]: buildRoute(
        ROUTES.MULTIPLE_CLIENT_HEARINGS,
        { claimId },
      ),
      [HowManyClientsRetainedChoice.MoreThanTwo]: buildRoute(
        ROUTES.MULTIPLE_CLIENT_HEARINGS,
        { claimId },
      ),
    };

    res.redirect(redirectByChoice[selectedChoice]);
  } catch (error) {
    const processedError = processError(
      error,
      "submitting how many clients retained page",
    );
    next(processedError);
  }
}
