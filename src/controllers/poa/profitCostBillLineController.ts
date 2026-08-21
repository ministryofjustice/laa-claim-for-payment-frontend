import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
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
import { getId } from "#src/helpers/queryParsers.js";

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
    const claimId = getId(req.params.claimId);

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      let lineItemId: string | undefined = undefined;

      const form = new ProfitCostBillLineForm();

      if (claim.body.lineItems.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
        const lineItem = claim.body.lineItems[0] as ProfitCostBillLineItem;
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
    const claimId = getId(req.params.claimId);
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
        lineItemId,
        lineItemForm,
      );
    }

    const claim = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (claim.status === "success") {
      // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- Ignore.
      const escaped = claim.body.escapedFlag;

      const route =
        escaped === true
          ? ROUTES.POA_EVIDENCE_UPLOAD
          : escaped === false
            ? ROUTES.POA_CHECK_YOUR_DETAILS
            : ROUTES.ESCAPING_FIXED_FEE;

      res.redirect(buildRoute(route, { claimId }));
    } else {
      next(
        processApiError(
          claim,
          "retrieving claim for submitting profit cost bill line page",
        ),
      );
    }
  } catch (error) {
    next(processError(error, "submitting profit cost bill line page"));
  }
}
