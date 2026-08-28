import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { requireClaim } from "#src/helpers/claimGuards.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { CostType } from "#src/types/Claim.js";

/**
 * load draft claim into request
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export async function loadDraftClaim(
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
      const { body } = claim;
      // eslint-disable-next-line require-atomic-updates -- Express creates a new req object per request
      req.claim = body;
      next();
    } else {
      next(processApiError(claim, "retrieving draft claim"));
    }
  } catch (error) {
    next(processError(error, "retrieving draft claim"));
  }
}

/**
 * require that claim has a disbursement cost type
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function requireDisbursementCostType(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    if (claim.disbursementCostType == null) {
      res.redirect(buildRoute(ROUTES.POA.CLAIM_TYPE, { claimId }));
    } else {
      next();
    }
  } catch (error) {
    next(processError(error, "requiring disbursement cost type"));
  }
}

/**
 * require that claim has a profit cost type
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function requireProfitCostType(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claim = requireClaim(req);
    const { id: claimId } = claim;
    if (claim.costType === CostType.PROFIT_COST) {
      next();
    } else {
      res.redirect(buildRoute(ROUTES.POA.CLAIM_TYPE, { claimId }));
    }
  } catch (error) {
    next(processError(error, "requiring disbursement cost type"));
  }
}
