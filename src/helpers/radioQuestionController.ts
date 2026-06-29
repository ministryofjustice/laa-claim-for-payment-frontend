import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import {
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { validateRadioInput } from "#src/helpers/validation.js";
import type { Message } from "#src/viewmodels/components/message.js";

interface RadioQuestionControllerParams<ChoiceType extends string> {
  title: Message;
  fieldName: string;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  messagePrefix: string;
  renderErrorContext: string;
  submitErrorContext: string;
  getRedirectUrl: (req: Request, selectedChoice: ChoiceType) => string;
}

/**
 * Creates GET and POST handlers for a generic radio question page.
 *
 * @param {RadioQuestionControllerParams} params Radio question configuration.
 * @returns {object} GET and POST Express handlers.
 */
export function createRadioQuestionController<ChoiceType extends string>({
  title,
  fieldName,
  choices,
  messagePrefix,
  renderErrorContext,
  submitErrorContext,
  getRedirectUrl,
}: RadioQuestionControllerParams<ChoiceType>): {
  get: (req: Request, res: Response, next: NextFunction) => void;
  post: (req: Request, res: Response, next: NextFunction) => void;
} {
  return {
    get(req: Request, res: Response, next: NextFunction): void {
      try {
        res.render("main/radioQuestionPage.njk", {
          csrfToken: res.locals.csrfToken,
          vm: new RadioQuestionViewModel({
            title,
            fieldName,
            choices,
          }),
        });
      } catch (error) {
        next(processError(error, renderErrorContext));
      }
    },

    post(req: Request, res: Response, next: NextFunction): void {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
        const selectedChoice: unknown = req.body?.[fieldName];

        const validationResult = validateRadioInput(
          choices,
          selectedChoice,
          fieldName,
          fieldName,
          messagePrefix,
        );

        if (!validationResult.isValid) {
          res.status(400).render("main/radioQuestionPage.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new RadioQuestionViewModel({
              title,
              fieldName,
              choices,
              selectedValue:
                typeof selectedChoice === "string" ? selectedChoice : undefined,
              errors: validationResult.errors,
            }),
          });
          return;
        }

        res.redirect(getRedirectUrl(req, validationResult.value));
      } catch (error) {
        next(processError(error, submitErrorContext));
      }
    },
  };
}