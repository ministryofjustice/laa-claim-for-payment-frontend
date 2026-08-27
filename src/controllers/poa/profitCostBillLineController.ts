import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import {
  ProfitCostBillLineForm,
  type ProfitCostBillLineRequestBody
} from "#src/helpers/profitCostBillLineValidation.js";
import { ProfitCostBillLineViewModel } from "#src/viewmodels/poa/profitCostBillLineViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { getRequestBody } from "#src/helpers/validation.js";
import { CostType, type ProfitCostBillLineItem } from "#src/types/Claim.js";
import type { LineItemForm } from "#src/types/poa.js";
import { requireClaim } from "#src/helpers/requireClaim.js";

/**
 * Display POA CPGFS profit cost bill line page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function profitCostBillLine(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    let lineItemId: string | undefined = undefined;

    const claim = requireClaim(req);

    const form = new ProfitCostBillLineForm();

    if (claim.lineItems.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
      const lineItem = claim.lineItems[0] as ProfitCostBillLineItem;
      ({ id: lineItemId } = lineItem);
      form.fill({
        activityDate: lineItem.date,
        actualNetProfitCostExcludingAdvocacy: lineItem.netProfitCostAmount,
        actualNetAdvocacyCosts: lineItem.netAdvocacyCostAmount,
        vatApplies: lineItem.vatApplicable,
        feeEarnerName: lineItem.feeEarnerName,
      });
    }

    res.render("main/poa/profitCostBillLineView.njk", {
      csrfToken: res.locals.csrfToken,
      lineItemId,
      vm: new ProfitCostBillLineViewModel({
        form,
      }),
    });
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
    const body = req.body as { lineItemId?: unknown };
    const lineItemId =
      typeof body.lineItemId === "string"
        ? UUID.parse(body.lineItemId)
        : undefined;

    const requestBody = getRequestBody(
      req.body,
    ) as ProfitCostBillLineRequestBody;

    const form = new ProfitCostBillLineForm();
    form.validate(requestBody);

    if (form.isNotValid()) {
      res.status(400).render("main/poa/profitCostBillLineView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ProfitCostBillLineViewModel({
          form,
        }),
      });
      return;
    }

    const lineItemForm: LineItemForm = {
      type: CostType.PROFIT_COST,
      value: form.getValue(),
    };

    const claim = requireClaim(req);
    const { id: claimId } = claim;

    if (lineItemId == null) {
      await claimService.addLineItemToClaim(
        req.axiosMiddleware,
        claimId,
        lineItemForm,
      );
    } else {
      await claimService.updateLineItem(
        req.axiosMiddleware,
        claimId,
        lineItemId.toString(),
        lineItemForm,
      );
    }

    const { escapedFlag: escaped } = claim;

    const route =
      escaped === true
        ? ROUTES.POA.EVIDENCE_UPLOAD
        : escaped === false
          ? ROUTES.POA.CHECK_DETAILS
          : ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE;

    res.redirect(buildRoute(route, { claimId }));
  } catch (error) {
    next(processError(error, "submitting profit cost bill line page"));
  }
}
