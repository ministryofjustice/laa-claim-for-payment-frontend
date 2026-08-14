import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import {
  ProfitCostDetailsViewModel,
  type ProfitCostDetailsViewModelParams
} from "#src/viewmodels/poa/profitCostDetailsViewModel.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { getForm } from "#src/helpers/validation.js";
import { type ProfitCostDetailsForm, validateProfitCostDetails } from "#src/helpers/profitCostDetailsValidation.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { UUID } from "uuidv7";
import { ClientPartyStatus, CourtType } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { formatBooleanChoice } from "#src/helpers/dataFormatters.js";

/**
 * Profit cost details journey view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function profitCostDetails(
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

    const params: ProfitCostDetailsViewModelParams = {
      form: {
        courtTypeChoice: claim.body?.courtType,
        clientStatusChoice: claim.body?.clientPartyStatus,
        firstSolicitorChoice: formatBooleanChoice(claim.body?.firstActingSolicitorFlag),
        transferOfSolicitorChoice: formatBooleanChoice(claim.body?.transferOfSolicitorFlag),
      }
    };

    res.render("main/poa/profitCostDetailsView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ProfitCostDetailsViewModel(params),
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering profit cost details page",
    );
    next(processedError);
  }
}

/**
 * Submit profit cost details journey
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function submitProfitCostDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const form = getForm(req.body) as ProfitCostDetailsForm;
    const validationResult = validateProfitCostDetails(form);

    if (!validationResult.isValid) {
      const params: ProfitCostDetailsViewModelParams = {
        form,
        errors: validationResult.errors
      };

      res.status(400).render("main/poa/profitCostDetailsView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostDetailsViewModel(params),
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
        claim.body.setProfitCostDetails(validationResult.value),
      );

      const redirectUrl = validationResult.value.transferOfSolicitor
        ? buildRoute(ROUTES.HOW_MANY_CLIENTS_RETAINED, { claimId })
        : buildRoute(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, { claimId });

      res.redirect(redirectUrl);
    } else {
      next(processApiError(claim, "retrieving claim for submitting profit cost details page"));
    }
  } catch (error) {
    const processedError = processError(error, "submitting profit cost details page");
    next(processedError);
  }
}

const PREFIX = "pages.profitCostDetails" as const;

export const PROFIT_COST_DETAILS_FIELDS = {
  courtType: {
    name: "courtTypeChoice",
    id: "courtTypeChoice",
    messagePrefix: `${PREFIX}.courtType`,
  },
  clientStatus: {
    name: "clientStatusChoice",
    id: "clientStatusChoice",
    messagePrefix: `${PREFIX}.clientStatus`,
  },
  firstSolicitor: {
    name: "firstSolicitorChoice",
    id: "firstSolicitorChoice",
    messagePrefix: `${PREFIX}.firstSolicitor`,
  },
  transferOfSolicitor: {
    name: "transferOfSolicitorChoice",
    id: "transferOfSolicitorChoice",
    messagePrefix: `${PREFIX}.transferOfSolicitor`,
  },
} as const;

export const courtTypeChoices: ReadonlyArray<RadioQuestionOptions<CourtType>> = [
  {
    value: CourtType.COUNTY_COURT,
    text: {
      key: `${PREFIX}.courtType.COUNTY_COURT.text`
    },
  },
  {
    value: CourtType.HIGH_COURT,
    text: {
      key: `${PREFIX}.courtType.HIGH_COURT.text`
    },
  },
  {
    value: CourtType.MAGISTRATES_COURT,
    text: {
      key: `${PREFIX}.courtType.MAGISTRATES_COURT.text`
    },
  },
  {
    value: CourtType.OTHER_JUDGE,
    text: {
      key: `${PREFIX}.courtType.OTHER_JUDGE.text`
    },
  },
] as const;

export const clientStatusChoices: ReadonlyArray<RadioQuestionOptions<ClientPartyStatus>> = [
  {
    value: ClientPartyStatus.CHILD,
    text: {
      key: `${PREFIX}.clientStatus.CHILD.text`
    },
  },
  {
    value: ClientPartyStatus.JOINED_PARTY,
    text: {
      key: `${PREFIX}.clientStatus.JOINED_PARTY.text`
    },
  },
  {
    value: ClientPartyStatus.PARENT,
    text: {
      key: `${PREFIX}.clientStatus.PARENT.text`
    },
  },
] as const;
