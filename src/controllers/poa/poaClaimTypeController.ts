import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import {
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { validateRadioInput } from "#src/helpers/validation.js";
import { UUID } from "uuidv7";
import { CostType } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { draftService } from "#src/services/draftService.js";

const poaClaimTypeFieldName = "poaClaimType" as const;

const poaClaimTypeChoices: ReadonlyArray<RadioQuestionOptions<CostType>> = [
  {
    value: CostType.PROFIT_COST,
    text: {
      key: "pages.poaClaimType.profitCost.text",
    },
  },
  {
    value: CostType.EXPERT_COST,
    text: {
      key: "pages.poaClaimType.expertCost.text",
    },
  },
  {
    value: CostType.NON_EXPERT_DISBURSEMENT,
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
 */
export async function poaClaimTypePage(
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
            key: "pages.poaClaimType.title",
          },
          fieldName: poaClaimTypeFieldName,
          fieldId: poaClaimTypeFieldName,
          choices: poaClaimTypeChoices,
          selectedValue: claim.body.costType,
        }),
      });
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for rendering POA claim type page",
        ),
      );
    }
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
 */
export async function submitPoaClaimType(
  req: Request,
  res: Response,
  next: NextFunction,
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
          fieldId: poaClaimTypeFieldName,
          choices: poaClaimTypeChoices,
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
      await draftService.setCostType(
        req.axiosMiddleware,
        claim.body,
        validationResult.value,
      );

      const redirectByChoice: Record<CostType, string> = {
        [CostType.PROFIT_COST]: buildRoute(ROUTES.PROFIT_COST_DETAILS, {
          claimId,
        }),
        [CostType.EXPERT_COST]: buildRoute(ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS, {
          claimId,
        }),
        [CostType.NON_EXPERT_DISBURSEMENT]: buildRoute(
          ROUTES.NON_EXPERT_COST_DETAILS,
          { claimId },
        ),
      };

      res.redirect(redirectByChoice[validationResult.value]);
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for submitting POA claim type page",
        ),
      );
    }
  } catch (error) {
    next(processError(error, "submitting POA claim type page"));
  }
}
