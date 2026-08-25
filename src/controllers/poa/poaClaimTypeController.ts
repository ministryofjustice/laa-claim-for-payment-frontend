import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { CostType } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { draftService } from "#src/services/draftService.js";
import { RadioField } from "#src/helpers/fields.js";
import { RadioQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import config from "#config.js";

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
      const form = new RadioQuestionForm(buildField());
      if (claim.body.costType != null) {
        form.fill(claim.body.costType);
      }
      res.render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
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
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    const form = new RadioQuestionForm(field);
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
      await draftService.setCostType(
        req.axiosMiddleware,
        claim.body,
        form.getValue(),
      );

      const redirectByChoice: Record<CostType, string> = {
        [CostType.PROFIT_COST]: buildRoute(ROUTES.PROFIT_COST_DETAILS, {
          claimId,
        }),
        [CostType.EXPERT_COST]: buildRoute(
          ROUTES.ADD_ANOTHER_DISBURSEMENT,
          {
            claimId,
          },
        ),
        [CostType.NON_EXPERT_DISBURSEMENT]: buildRoute(
          ROUTES.ADD_ANOTHER_DISBURSEMENT,
          {
            claimId,
          },
        ),
      };

      res.redirect(redirectByChoice[form.getValue()]);
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

function buildField(): RadioField<CostType, CostType> {
  const messagePrefix = "pages.poaClaimType";
  return new RadioField(
    messagePrefix,
    "poaClaimType",
    "poaClaimType",
    [
      ...(config.featureFlags.poaProfitCostEnabled
        ? [
            {
              value: CostType.PROFIT_COST,
              text: {
                key: "pages.poaClaimType.profitCost.text",
              },
            },
          ]
        : []),
      {
        value: CostType.EXPERT_COST,
        text: {
          key: `${messagePrefix}.expertCost.text`,
        },
      },
      {
        value: CostType.NON_EXPERT_DISBURSEMENT,
        text: {
          key: `${messagePrefix}.nonExpertDisbursement.text`,
        },
      },
    ],
    (value: CostType) => value,
  );
}

function buildViewModel(
  form: RadioQuestionForm<CostType, CostType>,
): RadioQuestionViewModel<CostType, CostType> {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
}
