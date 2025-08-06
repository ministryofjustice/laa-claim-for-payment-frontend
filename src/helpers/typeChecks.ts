import { Submission } from "#types/Submission.js";

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
  if (typeof obj !== 'object' || obj === null ) return false;

  const object = obj as Record<string, unknown>;

  for (const key of checkedFields) {
    if (typeof object[key] !== 'string') return false
  }

  if (!Array.isArray(object.claims)) return false

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