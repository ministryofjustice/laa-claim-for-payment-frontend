import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import {
  ExpertCostDetailsViewModel,
  type ExpertCostDetailsViewModelParams,
} from "#src/viewmodels/poa/expertCostDetailsViewModel.js";
import {
  type ExpertCostDetailsForm,
  ExpertCostDetailsSchema,
  validateExpertCostDetails,
} from "#src/helpers/expertCostDetailsValidation.js";
import { getForm } from "#src/helpers/validation.js";
import type { AnswersCache, Path } from "#src/services/answersCache.js";

const path = (expertCostId: number): Path =>
  ["poa", "expertCosts", expertCostId - 1];

/**
 * Display POA expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @param {{ answersCache: AnswersCache }} dependencies Controller dependencies.
 * @param {AnswersCache} dependencies.answersCache Cache used for storing journey answers.
 */
export async function expertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
  dependencies: { answersCache: AnswersCache },
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const expertCostId = Number(req.params.expertCostId);

    const cachedAnswer = await dependencies.answersCache.get(
      req.sessionID,
      claimId,
      path(expertCostId),
      ExpertCostDetailsSchema,
    );

    const params: ExpertCostDetailsViewModelParams = {
      claimId,
      expertCostId,
      form:
        cachedAnswer == null
          ? {}
          : {
              activityDateDay: cachedAnswer.activityDate.getDate().toString(),
              activityDateMonth: (cachedAnswer.activityDate.getMonth() + 1).toString(),
              activityDateYear: cachedAnswer.activityDate.getFullYear().toString(),
              actualNetValue: cachedAnswer.actualNetValue.toString(),
              vatApplies: cachedAnswer.vatApplies ? "yes" : "no",
              feeEarnerName: cachedAnswer.feeEarnerName,
              description: cachedAnswer.description,
            },
    };

    res.render("main/poa/expertCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ExpertCostDetailsViewModel(params),
    });
  } catch (error) {
    next(processError(error, "rendering expert cost details page"));
  }
}

/**
 * Submit expert cost details page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @param {{ answersCache: AnswersCache }} dependencies Controller dependencies.
 * @param {AnswersCache} dependencies.answersCache Cache used for storing journey answers.
 */
export async function submitExpertCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
  dependencies: { answersCache: AnswersCache },
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);
    const expertCostId = Number(req.params.expertCostId);

    const form = getForm(req.body) as ExpertCostDetailsForm;
    const validationResult = validateExpertCostDetails(form);

    if (!validationResult.isValid) {
      const params: ExpertCostDetailsViewModelParams = {
        claimId,
        expertCostId,
        form,
        errors: validationResult.errors,
      };

      res.status(400).render("main/poa/expertCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ExpertCostDetailsViewModel(params),
      });
      return;
    }

    await dependencies.answersCache.set(
      req.sessionID,
      claimId,
      path(expertCostId),
      validationResult.value,
    );

    // TODO - redirect to the 'add another work item' page
    res.redirect(
      buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting expert cost details page"));
  }
}