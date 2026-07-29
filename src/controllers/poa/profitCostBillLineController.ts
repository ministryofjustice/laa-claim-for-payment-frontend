import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { type ProfitCostBillLineForm, validateProfitCostBillLine } from "#src/helpers/profitCostBillLineValidation.js";
import { ProfitCostBillLineViewModel } from "#src/viewmodels/poa/profitCostBillLineViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { getForm } from "#src/helpers/validation.js";
import { formatBoolean } from "#src/helpers/dataFormatters.js";
import type { ProfitCostBillLineItem } from "#src/types/Claim.js";

/**
 * Display POA CPGFS profit cost bill line page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export async function profitCostBillLine(
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
      let lineItemId: string | undefined = undefined;
      let form: ProfitCostBillLineForm = {};

      if (claim.body.lineItems?.length === 1) {
        const lineItem = claim.body.lineItems[0] as ProfitCostBillLineItem;
        ({ id: lineItemId } = lineItem);
        form = {
          activityDateDay: lineItem.date.getDate().toString(),
          activityDateMonth: (lineItem.date.getMonth() + 1).toString(),
          activityDateYear: lineItem.date.getFullYear().toString(),
          actualNetProfitCostExcludingAdvocacy: lineItem.netProfitCostAmount?.toString(),
          actualNetAdvocacyCosts: lineItem.netAdvocacyCostAmount?.toString(),
          vatApplies: formatBoolean(lineItem.vatApplicable),
          feeEarnerName: lineItem.feeEarnerName,
        };
      }

      res.render("main/poa/profitCostBillLineView.njk", {
        csrfToken: res.locals.csrfToken,
        lineItemId,
        vm: new ProfitCostBillLineViewModel({
          claimId,
          form,
        }),
      });
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for rendering profit cost bill line page",
        ),
      );
    }
  } catch (error) {
    next(processError(error, "rendering profit cost bill line page"));
  }
}

/**
 * Submit POA CPGFS profit cost bill line page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export async function submitProfitCostBillLine(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
    const body = req.body as { lineItemId?: unknown };
    const lineItemId =
      typeof body.lineItemId === "string"
        ? UUID.parse(body.lineItemId)
        : undefined;

    const form = getForm(req.body) as ProfitCostBillLineForm;

    const validationResult = validateProfitCostBillLine(form);

    if (!validationResult.isValid) {
      res.status(400).render("main/poa/profitCostBillLineView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostBillLineViewModel({
          claimId,
          form,
          errors: validationResult.errors,
        }),
      });
      return;
    }

    if (lineItemId == null) {
      await claimService.addLineItemToClaim(
        req.axiosMiddleware,
        claimId,
        validationResult.value,
      );
    } else {
      await claimService.updateLineItem(
        req.axiosMiddleware,
        claimId,
        lineItemId,
        validationResult.value,
      );
    }

    res.redirect(
      buildRoute(ROUTES.POA_EVIDENCE_UPLOAD, {
        claimId,
      }),
    );
  } catch (error) {
    next(processError(error, "submitting profit cost bill line page"));
  }
}