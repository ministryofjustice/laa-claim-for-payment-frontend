import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { claimService } from "#src/services/claimService.js";
import { processApiError, processError } from "#src/helpers/index.js";

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
