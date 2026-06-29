import {
  RadioQuestionViewModel,
  isValidChoice,
} from "#src/viewmodels/radioQuestionViewModel.js";
import type { Request, Response, NextFunction } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { booleanChoices } from "#src/models/booleanChoice.js";

const escapingFixedFeeFieldName = "escapingFixedFee" as const;

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function escapingFixedFee(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    res.render("main/poa/escapingFixedFeeView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new RadioQuestionViewModel({
        title: "pages.escapingFixedFee.question", 
        fieldName: escapingFixedFeeFieldName, 
        choices: booleanChoices
      }),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "submitting escaping fixed fee page"
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
export function submitEscapingFixedFee(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[escapingFixedFeeFieldName];

    
    if (!isValidChoice(booleanChoices, selectedChoice)) {
      res.status(400).render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: "pages.escapingFixedFee.question",
          fieldName: escapingFixedFeeFieldName, 
          choices: booleanChoices,
          selectedValue: typeof selectedChoice === "string" ? selectedChoice : undefined,
          error: {
            text: {
              key: "pages.escapingFixedFee.error.empty"
            },
          },
        }),
      });
      return;
    }
    const claimId = Number(req.params.claimId);

    res.redirect(buildRoute(
            ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
            { claimId }));
            
  } catch (error) {
    const processedError = processError(
      error,
      "submitting escaping fixed fee page"
    );
    next(processedError);
  }
}