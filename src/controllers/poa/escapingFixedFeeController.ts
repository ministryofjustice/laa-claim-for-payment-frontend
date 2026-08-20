import {
  RadioQuestionViewModel,
  YesNoQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { draftService } from "#src/services/draftService.js";
import { BooleanField } from "#src/helpers/fields.js";
import type { BooleanChoice } from "#src/models/booleanChoice.js";
import { type RadioQuestionForm, YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

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
      const form = new YesNoQuestionForm(buildField());
      if (claim.body.escapedFlag != null) {
        form.fill(claim.body.escapedFlag);
      }
      res.render("main/poa/escapingFixedFeeView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
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
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    const form = new YesNoQuestionForm(field);
    form.validate(selectedChoice);

    if (form.isNotValid()) {
      res.status(400).render("main/poa/escapingFixedFeeView.njk", {
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
      await draftService.setEscapedFlag(
        req.axiosMiddleware,
        claim.body,
        form.getValue(),
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

function buildField(): BooleanField {
  return new BooleanField(PREFIX, "escapingFixedFee", "escapingFixedFee");
}

function buildViewModel(
  form: YesNoQuestionForm,
): YesNoQuestionViewModel {
  return new RadioQuestionViewModel({
    title: `${PREFIX}.question`,
    form,
    isLegendPageHeading: false,
  });
}
