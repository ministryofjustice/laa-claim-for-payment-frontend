import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { Count } from "#src/types/Claim.js";
import { claimService } from "#src/services/claimService.js";
import { RadioField } from "#src/helpers/fields.js";
import { RadioQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import { requireClaim } from "#src/helpers/claimGuards.js";

/**
 * get how many clients retained view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function howManyClientsRetained(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);

    const form = new RadioQuestionForm(buildField());
    if (claim.clientsStartCount != null) {
      form.fill(claim.clientsStartCount);
    }
    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: buildViewModel(form),
    });
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
    const form = new RadioQuestionForm(field);
    form.validate(selectedChoice);

    if (form.isNotValid()) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
      return;
    }

    const claim = requireClaim(req);
    const { id: claimId } = claim;

    await claimService.updateClaim(
      req.axiosMiddleware,
      claim.setClientsRetainedCount(form.getValue()),
    );

    const redirectByChoice: Record<Count, string> = {
      [Count.ZERO]: buildRoute(ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE, {
        claimId,
      }),
      [Count.ONE]: buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS, { claimId }),
      [Count.TWO_OR_MORE]: buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS, {
        claimId,
      }),
    };

    res.redirect(redirectByChoice[form.getValue()]);
  } catch (error) {
    const processedError = processError(error, "submitting how many clients retained page");
    next(processedError);
  }
}

function buildField(): RadioField<Count, Count> {
  const messagePrefix = "pages.howManyClientsRetained";
  return new RadioField(
    messagePrefix,
    "howManyClientsRetained",
    "howManyClientsRetained",
    [
      {
        value: Count.ZERO,
        text: {
          key: `${messagePrefix}.ZERO.text`,
        },
      },
      {
        value: Count.ONE,
        text: {
          key: `${messagePrefix}.ONE.text`,
        },
      },
      {
        value: Count.TWO_OR_MORE,
        text: {
          key: `${messagePrefix}.TWO_OR_MORE.text`,
        },
      },
    ],
    (value: Count) => value,
  );
}

function buildViewModel(
  form: RadioQuestionForm<Count, Count>,
): RadioQuestionViewModel<Count, Count> {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
}
