import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import { z } from "zod";
import {
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { validateRadioInput } from "#src/helpers/validation.js";
import type { AnswersCache } from "#src/services/answersCache.js";

const poaClaimTypeFieldName = "poaClaimType" as const;
const path = ["poa", "claimType"];

const PoaClaimTypeChoice = {
  ProfitCost: "profit-cost",
  ExpertCost: "expert-cost",
  NonExpertDisbursement: "non-expert-disbursement",
} as const;

type PoaClaimTypeChoice =
  (typeof PoaClaimTypeChoice)[keyof typeof PoaClaimTypeChoice];

const poaClaimTypeChoices: ReadonlyArray<RadioQuestionOptions<PoaClaimTypeChoice>> = [
  {
    value: PoaClaimTypeChoice.ProfitCost,
    text: {
      key: "pages.poaClaimType.profitCost.text",
    },
  },
  {
    value: PoaClaimTypeChoice.ExpertCost,
    text: {
      key: "pages.poaClaimType.expertCost.text",
    },
  },
  {
    value: PoaClaimTypeChoice.NonExpertDisbursement,
    text: {
      key: "pages.poaClaimType.nonExpertDisbursement.text",
    },
  },
];

/**
 * Display POA claim type page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @param {{ answersCache: AnswersCache }} dependencies Controller dependencies.
 * @param {AnswersCache} dependencies.answersCache Cache used for storing journey answers.
 */
export async function poaClaimTypePage(
  req: Request,
  res: Response,
  next: NextFunction,
  dependencies: { answersCache: AnswersCache },
): Promise<void> {
  try {
    const claimId = Number(req.params.claimId);

    const cachedAnswer = await dependencies.answersCache.get(
      req.sessionID,
      claimId,
      path,
      z.string(),
    );

    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new RadioQuestionViewModel({
        title: {
          key: "pages.poaClaimType.title",
        },
        fieldName: poaClaimTypeFieldName,
        choices: poaClaimTypeChoices,
        selectedValue: cachedAnswer,
      }),
    });
  } catch (error) {
    next(processError(error, "rendering POA claim type page"));
  }
}

/**
 * Submit POA claim type page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @param {{ answersCache: AnswersCache }} dependencies Controller dependencies.
 * @param {AnswersCache} dependencies.answersCache Cache used for storing journey answers.
 */
export async function submitPoaClaimType(
  req: Request,
  res: Response,
  next: NextFunction,
  dependencies: { answersCache: AnswersCache },
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[poaClaimTypeFieldName];

    const validationResult = validateRadioInput(
      poaClaimTypeChoices,
      selectedChoice,
      poaClaimTypeFieldName,
      poaClaimTypeFieldName,
      "pages.poaClaimType",
    );

    if (!validationResult.isValid) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: {
            key: "pages.poaClaimType.title",
          },
          fieldName: poaClaimTypeFieldName,
          choices: poaClaimTypeChoices,
          selectedValue:
            typeof selectedChoice === "string" ? selectedChoice : undefined,
          errors: validationResult.errors,
        }),
      });
      return;
    }

    const claimId = Number(req.params.claimId);

    await dependencies.answersCache.set(
      req.sessionID,
      claimId,
      path,
      validationResult.value,
    );

    const redirectByChoice: Record<PoaClaimTypeChoice, string> = {
      [PoaClaimTypeChoice.ProfitCost]: buildRoute(ROUTES.PROFIT_COST_DETAILS, {
        claimId,
      }),
      [PoaClaimTypeChoice.ExpertCost]: buildRoute(ROUTES.EXPERT_COST_DETAILS, {
        claimId,
        expertCostId: 1,
      }),
      [PoaClaimTypeChoice.NonExpertDisbursement]: buildRoute(
        ROUTES.NON_EXPERT_COST_DETAILS,
        { claimId },
      ),
    };

    res.redirect(redirectByChoice[validationResult.value]);
  } catch (error) {
    next(processError(error, "submitting POA claim type page"));
  }
}
