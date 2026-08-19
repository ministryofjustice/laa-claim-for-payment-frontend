import { RadioQuestionViewModel, yesNoQuestionForm } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { BooleanField } from "#src/helpers/fields.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function multipleClientHearings(
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
      const field = buildField();
      const form = yesNoQuestionForm(field);
      res.render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: `${PREFIX}.title`,
          form,
          isLegendPageHeading: true,
        }),
      });
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for rendering multiple client hearings page",
        ),
      );
    }
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
export async function submitMultipleClientHearings(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    field.validate(selectedChoice);

    const form = yesNoQuestionForm(field);

    if (form.isNotValid()) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: `${PREFIX}.title`,
          form,
          isLegendPageHeading: true,
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
        claim.body.setMultiClientHearingFlag(form.getValue()),
      );

      res.redirect(buildRoute(ROUTES.ESCAPING_FIXED_FEE, { claimId }));
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for submitting multiple client hearings page",
        ),
      );
    }
  } catch (error) {
    const processedError = processError(
      error,
      "submitting multiple client hearings page",
    );
    next(processedError);
  }
}

const PREFIX = "pages.multipleClientHearings" as const;

function buildField(): BooleanField {
  return new BooleanField(
    PREFIX,
    "multipleClientHearings",
    "multipleClientHearings",
  );
}
