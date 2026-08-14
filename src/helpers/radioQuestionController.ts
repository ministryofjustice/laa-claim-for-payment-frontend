import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import {
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { type Field, validateRadioInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import type { Claim } from "#src/types/Claim.js";

interface RadioQuestionControllerParams<ChoiceType extends string> {
  title: string;
  field: Field;
  choices: ReadonlyArray<RadioQuestionOptions<ChoiceType>>;
  renderErrorContext: string;
  submitErrorContext: string;
  getRedirectUrl: (req: Request, selectedChoice: ChoiceType) => string;
  getValue: (claim: Claim) => ChoiceType | null | undefined;
  setValue: (claim: Claim, selectedChoice: ChoiceType) => Claim;
}

/**
 * Creates GET and POST handlers for a generic radio question page.
 *
 * @param {RadioQuestionControllerParams} params Radio question configuration.
 * @returns {object} GET and POST Express handlers.
 */
export function createRadioQuestionController<ChoiceType extends string>({
  title,
  field,
  choices,
  renderErrorContext,
  submitErrorContext,
  getRedirectUrl,
  getValue,
  setValue,
}: RadioQuestionControllerParams<ChoiceType>): {
  get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  post: (req: Request, res: Response, next: NextFunction) => Promise<void>;
} {
  return {
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const claimId = UUID.parse(req.params.claimId);

        const claim = await claimService.getDraftClaim(
          req.axiosMiddleware,
          claimId,
        );

        if (claim.status === "success") {
          res.render("main/radioQuestionPage.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new RadioQuestionViewModel({
              title,
              field,
              choices,
              selectedValue: getValue(claim.body),
            }),
          });
        } else {
          next(
            processApiError(
              claim,
              `retrieving claim for ${renderErrorContext}`,
            ),
          );
        }
      } catch (error) {
        next(processError(error, renderErrorContext));
      }
    },

    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
        const selectedChoice: unknown = req.body?.[field.name];

        const validationResult = validateRadioInput(
          choices,
          selectedChoice,
          field,
        );

        if (!validationResult.isValid) {
          res.status(400).render("main/radioQuestionPage.njk", {
            csrfToken: res.locals.csrfToken,
            vm: new RadioQuestionViewModel({
              title,
              field,
              choices,
              errors: validationResult.errors,
            }),
          });
          return;
        }

        const claimId = UUID.parse(req.params.claimId);

        const claim = await claimService.getDraftClaim(
          req.axiosMiddleware,
          claimId,
        );

        if (claim.status === "success") {
          await claimService.updateClaim(
            req.axiosMiddleware,
            setValue(claim.body, validationResult.value),
          );

          res.redirect(getRedirectUrl(req, validationResult.value));
        } else {
          next(
            processApiError(
              claim,
              `retrieving claim for ${submitErrorContext}`,
            ),
          );
        }
      } catch (error) {
        next(processError(error, submitErrorContext));
      }
    },
  };
}