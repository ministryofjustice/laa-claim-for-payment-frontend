import type { Request } from "express";
import type { Claim, DisbursementCostType } from "#src/types/Claim.js";

/**
 * Require that claim loaded on to request
 * @param {Request} req Express request object
 * @returns {Claim} claim
 * @throws if claim not loaded on to request
 */
export function requireClaim(req: Request): Claim {
  if (req.claim == null) {
    throw new Error("Draft claim not loaded");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
  return req.claim;
}

/**
 * Require that claim has a disbursement cost type
 * @param {Claim} claim claim
 * @returns {DisbursementCostType} the disbursement cost type
 * @throws if claim does not have a disbursement cost type
 */
export function requireDisbursementCostType(claim: Claim): DisbursementCostType {
  if (claim.disbursementCostType == null) {
    throw new Error("Claim does not have a disbursement cost type");
  }

  return claim.disbursementCostType;
}
