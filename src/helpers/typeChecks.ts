import { Claim } from "#types/Claim.js";
import { isRecord } from "./dataTransformers.js";

/**
 * Type Check Helper
 *
 * Allows the functionality of checking runtime type of objects
 * as a secondary type safety mechanism for API calls.
 *
 * @param {unknown} obj - the value undergoing type check
 * @returns {boolean} depending on success/fail of checks
 *
 */
export function isClaim(obj: unknown): obj is Claim {
  if (!isRecord(obj)) return false;

  for (const key of checkedFields) {
    if (typeof obj[key] !== "string") return false;
  }

  return true;
}

const checkedFields = [
  "id",
  "client",
  "category",
  "concluded",
  "feeType",
  "claimed",
  "submissionId",
];
