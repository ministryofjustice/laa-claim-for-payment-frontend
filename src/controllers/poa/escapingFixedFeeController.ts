import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { booleanChoices } from "#src/models/booleanChoice.js";
import { validateBooleanInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { formatBoolean } from "#src/helpers/dataFormatters.js";

const escapingFixedFeeFieldName = "escapingFixedFee" as const;

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
          title: {
            key: "pages.escapingFixedFee.question",
          },
          fieldName: escapingFixedFeeFieldName,
          choices: booleanChoices,
          selectedValue: formatBoolean(claim.body.escapedFlag),
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
    const selectedChoice: unknown = req.body?.[escapingFixedFeeFieldName];

    const validationResult = validateBooleanInput(
      selectedChoice,
      escapingFixedFeeFieldName,
      escapingFixedFeeFieldName,
      "pages.escapingFixedFee",
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.escapingFixedFee.question",
          },
          fieldName: escapingFixedFeeFieldName,
          choices: booleanChoices,
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
      // TODO - cleanup evidence when answer is No
      await claimService.updateClaim(
        req.axiosMiddleware,
        claim.body.setEscapedFlag(validationResult.value),
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
