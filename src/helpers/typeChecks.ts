import type { Submission } from "#types/Submission.js";
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
export function isSubmission(obj: unknown): obj is Submission {
  if(!isRecord(obj)) return false

  for (const key of checkedFields) {
    if (typeof obj[key] !== 'string') return false
  }

  if (!Array.isArray(obj.claims)) return false

  return true
}

const checkedFields = [
  'providerUserId',
   'friendlyId',
   'providerOfficeId',
   'submissionTypeCode',
   'submissionDate',
   'submissionPeriodStartDate',
   'submissionPeriodEndDate',
   'scheduleId',
  ]