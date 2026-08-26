import type { Claim } from "#src/types/Claim.js";
import type { Request } from "express";

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
