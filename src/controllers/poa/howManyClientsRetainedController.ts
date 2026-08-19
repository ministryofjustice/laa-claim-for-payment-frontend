import { radioQuestionForm, RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processApiError, processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { UUID } from "uuidv7";
import { Count } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { RadioField } from "#src/helpers/fields.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function howManyClientsRetained(
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
      field.setValue(claim.body.clientsRetainedCount);
      const form = radioQuestionForm(field);
      res.render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new RadioQuestionViewModel({
          title: `${PREFIX}.title`,
          form,
          isLegendPageHeading: true,
        }),
      });
    } else {
      next(processApiError(claim, "retrieving claim for rendering how many clients retained page"));
    }
  } catch (error) {
    const processedError = processError(error, "rendering how many clients retained page");
    next(processedError);
  }
}

/**
 * Submit how many clients retained
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function submitHowManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    field.validate(selectedChoice);
    const form = radioQuestionForm(field);

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
        claim.body.setClientsRetainedCount(form.getValue()),
      );

      const redirectByChoice: Record<Count, string> = {
        [Count.ZERO]: buildRoute(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, {
          claimId,
        }),
        [Count.ONE]: buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, { claimId }),
        [Count.TWO_OR_MORE]: buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
          claimId,
        }),
      };

      res.redirect(redirectByChoice[form.getValue()]);
    } else {
      next(processApiError(claim, "retrieving claim for submitting how many clients retained page"));
    }
  } catch (error) {
    const processedError = processError(error, "submitting how many clients retained page");
    next(processedError);
  }
}

const PREFIX = "pages.howManyClientsRetained" as const;

function buildField(): RadioField<Count, Count> {
  return new RadioField(
    PREFIX,
    "howManyClientsRetained",
    "howManyClientsRetained",
    [
      {
        value: Count.ZERO,
        text: {
          key: `${PREFIX}.ZERO.text`,
        },
      },
      {
        value: Count.ONE,
        text: {
          key: `${PREFIX}.ONE.text`,
        },
      },
      {
        value: Count.TWO_OR_MORE,
        text: {
          key: `${PREFIX}.TWO_OR_MORE.text`,
        },
      },
    ],
    (value: Count) => value,
  );
}
