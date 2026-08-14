import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { booleanChoices } from "#src/models/booleanChoice.js";
import { validateBooleanInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { formatBooleanChoice } from "#src/helpers/dataFormatters.js";
import { draftService } from "#src/services/draftService.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function escapingFixedFee(
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
      res.render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: `${PREFIX}.question`,
          field: ESCAPING_FIXED_FEE_FIELD,
          choices: booleanChoices,
          selectedValue: formatBooleanChoice(claim.body.escapedFlag),
        }),
      });
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for rendering escaping fixed fee page",
        ),
      );
    }
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[ESCAPING_FIXED_FEE_FIELD.name];

    const validationResult = validateBooleanInput(
      selectedChoice,
      ESCAPING_FIXED_FEE_FIELD,
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: `${PREFIX}.question`,
          field: ESCAPING_FIXED_FEE_FIELD,
          choices: booleanChoices,
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
      await draftService.setEscapedFlag(
        req.axiosMiddleware,
        claim.body,
        validationResult.value,
      );

      res.redirect(buildRoute(ROUTES.CPGFS_PROFIT_COST_BILL_LINE, { claimId }));
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for submitting escaping fixed fee page",
        ),
      );
    }
  } catch (error) {
    const processedError = processError(
      error,
      "submitting escaping fixed fee page",
    );
    next(processedError);
  }
}

const PREFIX = "pages.escapingFixedFee" as const;

export const ESCAPING_FIXED_FEE_FIELD = {
  name: "escapingFixedFee",
  id: "escapingFixedFee",
  messagePrefix: PREFIX,
} as const;
