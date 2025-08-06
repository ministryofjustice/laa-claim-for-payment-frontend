import { Submission } from "#types/Submission.js";

/**
 * Type Check Helper
 * 
 * Allows the functionality of checking runtime type of objects
 * as a secondary type safety mechanism for API calls.
 * 
 */

// function to check runtime type is of Submission
export function isSubmission(obj: unknown): obj is Submission {
  return typeof obj === 'object'
  && obj !== null
  && 'providerUserId' in obj
  && 'friendlyId' in obj
  && 'providerOfficeId' in obj
  && 'submissionTypeCode' in obj
  && 'submissionDate' in obj
  && 'submissionPeriodStartDate' in obj
  && 'submissionPeriodEndDate' in obj
  && 'scheduleId' in obj
  && 'claims' in obj
  && Array.isArray((obj as any).claims)
}
