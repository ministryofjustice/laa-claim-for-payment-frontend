import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import type { Claim } from "#src/types/Claim.js";
import type { RadioField } from "#src/helpers/fields.js";
import { RadioQuestionForm } from "#src/helpers/radioQuestionValidation.js";

interface RadioQuestionControllerParams<ChoiceType extends string> {
  buildField: () => RadioField<ChoiceType, ChoiceType>;
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
  buildField,
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
          const form = new RadioQuestionForm(buildField());
          const value = getValue(claim.body);
          if (value != null) {
            form.fill(value);
          }
          res.render("main/radioQuestionPage.njk", {
            csrfToken: res.locals.csrfToken,
            vm: buildViewModel(form),
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
        const field = buildField();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
        const selectedChoice: unknown = req.body?.[field.name];
        const form = new RadioQuestionForm(buildField());
        form.validate(selectedChoice);

        if (form.isNotValid()) {
          res.status(400).render("main/radioQuestionPage.njk", {
            csrfToken: res.locals.csrfToken,
            vm: buildViewModel(form),
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
            setValue(claim.body, form.getValue()),
          );

          res.redirect(getRedirectUrl(req, form.getValue()));
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

function buildViewModel<ChoiceType>(
  form: RadioQuestionForm<ChoiceType, ChoiceType>,
): RadioQuestionViewModel<ChoiceType, ChoiceType> {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
}
