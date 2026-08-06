import { type RadioQuestionOptions, RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { validateRadioInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { Count } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";

const howManyClientsRetainedFieldName = "howManyClientsRetained" as const;

const howManyClientsRetainedChoices: ReadonlyArray<RadioQuestionOptions<Count>> =
  [
    {
      value: Count.ZERO,
      text: {
        key: "pages.howManyClientsRetained.ZERO.text",
      },
    },
    {
      value: Count.ONE,
      text: {
        key: "pages.howManyClientsRetained.ONE.text",
      },
    },
    {
      value: Count.TWO_OR_MORE,
      text: {
        key: "pages.howManyClientsRetained.TWO_OR_MORE.text",
      },
    },
  ];

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function howManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
          title: {
            key: "pages.howManyClientsRetained.title",
          },
          fieldName: howManyClientsRetainedFieldName,
          fieldId: howManyClientsRetainedFieldName,
          choices: howManyClientsRetainedChoices,
          selectedValue: claim.body.clientsRetainedCount,
        }),
      });
    } else {
      next(processApiError(claim, "retrieving claim for rendering how many clients retained page"));
    }
  } catch (error) {
    const processedError = processError(error, "rendering how many clients retained page");
    next(processedError);
  }
}

/**
 * Submit how many clients retained
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function submitHowManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[howManyClientsRetainedFieldName];

    const validationResult = validateRadioInput(
      howManyClientsRetainedChoices,
      selectedChoice,
      howManyClientsRetainedFieldName,
      howManyClientsRetainedFieldName,
      "pages.howManyClientsRetained",
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.howManyClientsRetained.title"
          },
          fieldName: howManyClientsRetainedFieldName,
          fieldId: howManyClientsRetainedFieldName,
          choices: howManyClientsRetainedChoices,
          selectedValue:
            typeof selectedChoice === "string" ? selectedChoice : undefined,
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
        claim.body.setClientsRetainedCount(validationResult.value),
      );

      const redirectByChoice: Record<Count, string> = {
        [Count.ZERO]: buildRoute(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, {
          claimId,
        }),
        [Count.ONE]: buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, { claimId }),
        [Count.TWO_OR_MORE]: buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
          claimId,
        }),
      };

      res.redirect(redirectByChoice[validationResult.value]);
    } else {
      next(processApiError(claim, "retrieving claim for submitting how many clients retained page"));
    }
  } catch (error) {
    const processedError = processError(error, "submitting how many clients retained page");
    next(processedError);
  }
}
